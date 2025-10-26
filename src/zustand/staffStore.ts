import { create } from "zustand";

// import type { StaffDataType, SalaryRecord, EmployeeAttendanceType } from "../Pages/BodyComponent/Financial/DataTest/DataForStaffSalary";
import { GetStaffList_API, AddStaff_API, UpdateSalary_API } from "../configs/api";
import { useAuthStore } from "./authStore";

export const SalaryByPosition: Record<StaffRole, number> = {
  Director: 30000000,
  Manager: 8000000,
  "Sale-Staff": 6000000,
  Security: 6000000,
  Packer: 6000000,
  admin: 0,
};

export type StaffRole = "Director" | "Manager" | "Sale-Staff" | "Security" | "Packer" | "admin";

export type RelationshipStatus = "single" | "married" | "divorced" | "widowed" | "complicated";
export type Religion = "Catholic" | "Buddhist" | "Muslim" | "No Religion" | "Other";

export interface SalaryRecord {
  time: string; // YYYY-MM, easier to filter by month
  baseSalary: number; // salary before bonus/fine
  totalCloseOrder: number;
  totalDistributionOrder: number;
  totalRevenue: number; // total revenue handled by staff
  fine?: {
    note: string;
    value: number;
  };
  bonus?: {
    note: string;
    value: number;
  };
}

export interface StaffInfoType {
  name: string;
  birthday: string; // ISO string (easier than Date object for JSON)
  address: string;
  phone: string;
  relationshipStatus: RelationshipStatus;
  religion: Religion;
  description: string;
  identityId: string;
  accountLogin: string;
}

export interface StaffDataType {
  _id?: string;
  role: StaffRole;
  salary: number; // current base salary
  joinedDate: string; // ISO date string
  quitDate?: string; // optional if staff still works
  isOnline: boolean;
  lastSeen: string;
  claimedAt: string;
  isMorningBatch: boolean;
  staffID: string;
  staffInfo: StaffInfoType;
  userId?: string;
  diligenceCount: number; // Current count the day staff go to work on time in a month. Reset in new month
  bankInfos: {
    bankAccountNumber: string;
    bankOwnerName: string;
  };
  salaryHistory: SalaryHistoryType[];
  attendance: EmployeeAttendanceType[]; // update everyday.
  dailyRecords: DailyRecordType[];
}

export interface DailyRecordType {
  date: string;
  bonus: number;
  bonusNote: string;
  fine: number;
  fineNote: string;
  overtime: number;
  overtimeNote: string;
}
export interface SalaryHistoryType {
  time: string; // YYYY-MM format
  baseSalary: number;
  totalCloseOrder: number;
  totalDistributionOrder: number;
  totalRevenue: number;
  isPaid?: boolean;
  fine: {
    note: string;
    value: number;
    time?: string;
  };
  bonus: {
    note: string;
    value: number;
    time?: string;
  };
  overtime: {
    totalTime: number;
    value: number;
    note: string;
  };
  attendance: EmployeeAttendanceType[];

  dailyRecords: DailyRecordType[];
}

export interface EmployeeAttendanceType {
  date: string;
  checked: "onTime" | "late" | "absent";
  note?: string;
}
export interface StaffInfoType {
  name: string;
  birthday: string; // ISO date
  address: string;
  phone: string;
  relationshipStatus: RelationshipStatus;
  religion: "Catholic" | "Buddhist" | "Muslim" | "No Religion" | "Other";
}

interface StaffState {
  staffList: StaffDataType[];
  loading: boolean;
  error: string | null;
  yourStaffProfile: StaffDataType | null ;
  staffID: string | null;
  userId: string | null;
  fetchStaff: () => Promise<{ status: string; message: string } | undefined>;
  fetchYourStaffProfile: (staffID: string, userId: string) => Promise<{ status: string; message: string, } | undefined>;
  addStaff: (newStaff: StaffDataType) => void; // 👈 new action
  updateStaff: (updated: StaffDataType) => void; // 👈 new
  appendSalaryHistory: (staffID: string, records: SalaryHistoryType[]) => void;
  appendAttendance: (staffID: string, records: EmployeeAttendanceType[]) => void;
  appendDailyRecord: (staffID: string, records: DailyRecordType[]) => void;
  updateSalary: (updated: StaffDataType) => void; // 👈 new
  updateStaffID: (staffID: string) => Promise<void>;
  updateUserId: (userId: string) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set) => ({
  // const { getAuthHeader } = useAuthStore();
  staffList: [],
  loading: false,
  error: null,
  yourStaffProfile: null,
  staffID: null,
  userId: null,
  fetchStaff: async () => {
    set({ loading: true, error: null });
    try {
      const { getAuthHeader, logout } = useAuthStore.getState();
      const res = await fetch(GetStaffList_API, { headers: { ...getAuthHeader() } });
      if (!res.ok) throw new Error(`Failed to fetch staff: ${res.status}`);
      const data = await res.json();
      if (res.status === 401) {
        logout();
        window.location.href = "/login";
        return { status: "No valid token", message: data.message };
      }
      set({ staffList: data, loading: false });
      return { status: "success", message: "" };
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { status: "failed", message: err.message };
    }
  },
  fetchYourStaffProfile: async (staffID, userId) => {
    set({ loading: true, error: null });
    try {
      const { getAuthHeader, logout } = useAuthStore.getState();
      const res = await fetch(`${GetStaffList_API}/${staffID}/${userId}`, { headers: { ...getAuthHeader() } });
      if (!res.ok) throw new Error(`Failed to fetch staff: ${res.status}`);
      const data = await res.json();
      if (res.status === 401) {
        logout();
        window.location.href = "/login";
        return { status: "No valid token", message: data.message };
      }
      set({ yourStaffProfile: data, loading: false });
      return { status: "success", message: "" };
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { status: "failed", message: err.message, data: null };
    }
  },

  addStaff: (newStaff) =>
    set((state) => ({
      staffList: [...state.staffList, newStaff],
    })),
  updateStaff: (updated) =>
    set((state) => ({
      staffList: state.staffList.map((s) => (s.staffID === updated.staffID ? updated : s)),
    })),

  appendSalaryHistory: (staffID, records) =>
    set((state) => ({
      staffList: state.staffList.map((s) => (s.staffID === staffID ? { ...s, salaryHistory: [...s.salaryHistory, ...records] } : s)),
    })),

  appendAttendance: (staffID, records) =>
    set((state) => ({
      staffList: state.staffList.map((s) => (s.staffID === staffID ? { ...s, attendance: [...s.attendance, ...records] } : s)),
    })),
  appendDailyRecord: (staffID, records) =>
    set((state) => ({
      staffList: state.staffList.map((s) => (s.staffID === staffID ? { ...s, dailyRecords: [...(s.dailyRecords ?? []), ...records] } : s)),
    })),
  updateSalary: async (updated) => {
    set({ loading: true, error: null });
    try {
      const { getAuthHeader } = useAuthStore.getState();
      const res = await fetch(UpdateSalary_API, { headers: { ...getAuthHeader() } });
      if (!res.ok) throw new Error(`Failed to fetch staff: ${res.status}`);
      const data = await res.json();
      set({ staffList: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateStaffID: async (staffID) => {
    set(() => ({
      staffID: staffID,
    }));
  },
  updateUserId: async (userId) => {
    set(() => ({
      userId: userId,
    }));
  },
}));
