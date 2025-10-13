import staffSalaryInput from "./staffSalaryData.json";

const SalaryByPosition: Record<StaffRole, number> = {
  Director: 30000000,
  Manager: 8000000,
  "Sale-Staff": 6000000,
  Security: 6000000,
  Packer: 6000000,
};

type StaffRole = "Director" | "Manager" | "Sale-Staff" | "Security" | "Packer";

export type RelationshipStatus = "single" | "married" | "divorced" | "widowed" | "complicated";
type Religion = "Catholic" | "Buddhist" | "Muslim" | "No Religion" | "Other";

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

export interface StaffDataType {
  _id: string;
  role: StaffRole;
  salary: number; // current base salary
  joinedDate: string; // ISO date string
  quitDate?: string; // optional if staff still works
  staffID: string;

  staffInfo: {
    name: string;
    birthday: string; // ISO string (easier than Date object for JSON)
    address: string;
    phone: string;
    relationshipStatus: RelationshipStatus;
    religion: Religion;
    description: string;
    identityId: string;
    accountLogin: string;
  };
  diligenceCount: number; // Current count the day staff go to work on time in a month. Reset in new month
  bankInfos: {
    bankAccountNumber: string;
    bankOwnerName: string;
  };
  salaryHistory: SalaryRecord[];
  attendance: EmployeeAttendanceType[]; // update everyday.
}
export interface SalaryHistoryType {
  time: string; // YYYY-MM format
  baseSalary: number;
  totalCloseOrder: number;
  totalDistributionOrder: number;
  totalRevenue: number;
  isPaid?: Boolean;
  fine?: {
    note: string;
    value: number;
    time?: string;
  };
  bonus?: {
    note: string;
    value: number;
    time?: string;
  };
}

export interface EmployeeAttendanceType {
  date: string;
  checked: "onTime" | "late" | "absent";
  note?: string;
  overtimeHours?: number;
}
export interface StaffInfoType {
  name: string;
  birthday: string; // ISO date
  address: string;
  phone: string;
  relationshipStatus: RelationshipStatus;
  religion: "Catholic" | "Buddhist" | "Muslim" | "No Religion" | "Other";
}

const staffSalaryData: StaffDataType[] = staffSalaryInput.map((item: any) => ({
  ...item,
  role: item.role as StaffRole,
  staffInfo: {
    ...item.staffInfo,
    relationshipStatus: item.staffInfo.relationshipStatus as RelationshipStatus,
    religion: item.staffInfo.religion as Religion,
  },
  diligenceCount: item.diligenceCount ?? 0,
  bankInfos: item.bankInfos ?? {
    bankAccountNumber: "",
    bankOwnerName: "",
  },
  attendance:
    item.attendance?.map((data: any) => {
      return {
        date: data.date,
        checked: data.checked,
        note: data.note || "Test hover",
      };
    }) ?? [],
  salaryHistory: item.salaryHistory ?? [],
}));

export { staffSalaryData };
