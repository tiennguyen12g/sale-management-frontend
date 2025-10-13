const SalaryByPosition: Record<StaffRole, number> = {
  Director: 30000000,
  Manager: 8000000,
  "Sale-Staff": 6000000,
  Security: 6000000,
  Packer: 6000000,
};

type StaffRole = "Director" | "Manager" | "Sale-Staff" | "Security" | "Packer";

type RelationshipStatus = "single" | "married" | "divorced" | "widowed" | "complicated";
type Religion = "Catholic" | "Buddhist" | "Muslim" | "No Religion" | "Other";

interface SalaryRecord {
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

interface StaffDataType {
  id: string;
  role: StaffRole;
  salary: number; // current base salary
  joinedDate: string; // ISO date string
  quitDate?: string; // optional if staff still works
  staffInfo: {
    name: string;
    birthday: string; // ISO string (easier than Date object for JSON)
    address: string;
    phone: string;
    relationshipStatus: RelationshipStatus;
    religion: Religion;
  };
  salaryHistory: SalaryRecord[];
}
