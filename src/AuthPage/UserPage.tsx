import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./UserPage.module.scss";
const cx = classNames.bind(styles);

import AddUserInfo from "./AddUserInfo";
import { useStaffStore } from "../zustand/staffStore";
import type { StaffDataType, StaffInfoType, StaffRole } from "../zustand/staffStore";
import { useAuthStore, type UserType } from "../zustand/authStore";
import { AddStaff_API, ChangePassword_API } from "../configs/api";
import { SalaryByPosition } from "../zustand/staffStore";
import { useNavigate, NavLink } from "react-router-dom";
import AttendanceCalendar from "../Pages/BodyComponent/Financial/Staff/AttendanceCalendar";
import type { SalaryHistoryType, EmployeeAttendanceType, DailyRecordType } from "../zustand/staffStore";
import { deligenceBonus, workingDayPerMonth } from "../configs/DefaultData";
import StaffHeartbeat from "../LandingOrders/StaffHeartBeat";
import StaffTracking from "../LandingOrders/StaffTracking";
export interface FormGetUserInfo {
  name: string;
  birthday: string;
  address: string;
  phone: string;
  relationshipStatus: string;
  religion: string;
  role: StaffRole;
  salary: number;
  joinedDate: string;
  diligenceCount: number;
  bankAccountNumber: string;
  bankOwnerName: string;
  description: string;
  accountLogin: string;
  identityId: string;
}
export default function UserPage() {
  // fake initial user data (can be fetched from server later)

  const { fetchStaff, staffList, addStaff } = useStaffStore();
  const { user, getAuthHeader, logout } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const initialForm: Omit<StaffDataType, "_id"> = {
    role: (user?.staffRole as StaffRole) || "Sale-Staff",
    staffID: "",
    salary: user && user.staffRole ? SalaryByPosition[user.staffRole] : 0,
    joinedDate: new Date().toISOString().split("T")[0],
    isOnline: false,
    lastSeen: "",
    staffInfo: {
      name: "",
      birthday: "",
      address: "",
      phone: "",
      relationshipStatus: "single",
      religion: "No Religion",
      description: "",
      identityId: "",
      accountLogin: "",
    },
    diligenceCount: 0,
    bankInfos: {
      bankAccountNumber: "",
      bankOwnerName: "",
    },
    salaryHistory: [],
    attendance: [],
    dailyRecords: [],
      isMorningBatch: false,
      claimedAt: "",
  };

  const [fullUserData, setFullUserData] = useState<StaffDataType>(staffList[0] || initialForm);
  const [userData, setUserData] = useState<StaffInfoType>(fullUserData.staffInfo);

  const [filterMode, setFilterMode] = useState<"all" | "month">("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null);

  useEffect(() => {
    if (staffList.length > 0 && user) {
      const staff = staffList.find((s) => s.userId === user.id);
      if (staff) {
        setFullUserData(staff);
        setUserData(staff.staffInfo);
      }
    }
  }, [staffList, user]);

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [error, setError] = useState("");
  const [showAccountForm, setShowAccountForm] = useState(false);

  // --- add state for sorting ---
  const [sortField, setSortField] = useState<"closingRate" | "diligence" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (repeatPass !== newPassword) {
      setError("Mật khẩu mới không khớp nhau");
    } else {
      setError("");
    }
  }, [repeatPass, newPassword]);

  const handleChangePass = async () => {
    if (!user) {
      setError("Có lỗi, báo lại quản trị viên.");
      return;
    }
    const res = await fetch(ChangePassword_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ userId: user.id, oldPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Đổi mật khẩu thành công");
      setShowAccountForm(false);
    } else {
      alert("Error: " + data.message);
    }
  };

  const getFilteredHistory = (staff: StaffDataType) => {
    if (filterMode === "all") return staff.salaryHistory;
    return staff.salaryHistory.filter((h) => {
      const [y, m] = h.time.split("-").map(Number);
      return y === selectedYear && m === selectedMonth;
    });
  };

  const calcSeniority = (joinedDate: string) => {
    const start = new Date(joinedDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return `${diff} months`;
  };

  // Calculate aggregates per staff
  const calculateStaffSummary = (staff: StaffDataType) => {
    let totalCloseOrder = 0;
    let totalDistributionOrder = 0;
    let totalRevenue = 0;
    let totalBonus = 0;
    let totalFine = 0;
    let totalOvertime = 0;

    staff.salaryHistory.forEach((h) => {
      totalCloseOrder += h.totalCloseOrder;
      totalDistributionOrder += h.totalDistributionOrder;
      totalRevenue += h.totalRevenue;
      totalOvertime += h.overtime.value;
      if (h.bonus) totalBonus += h.bonus.value;
      if (h.fine) totalFine += h.fine.value;
    });

    let totalOvertimeFix = Math.round((totalOvertime / 1000) * 1000);
    const totalSalary = staff.salaryHistory.reduce((acc, h) => acc + h.baseSalary + (h.bonus?.value || 0) - (h.fine?.value || 0) + (h.overtime.value || 0), 0);
    const totalSalaryFix = Math.round((totalSalary / 1000) * 1000);
    return {
      totalCloseOrder,
      totalDistributionOrder,
      totalRevenue,
      totalBonus,
      totalFine,
      totalOvertime: totalOvertimeFix,
      totalSalary: totalSalaryFix,
      rate: totalDistributionOrder > 0 ? ((totalCloseOrder / totalDistributionOrder) * 100).toFixed(2) + "%" : "0%",
    };
  };

  // --- helper to calculate stats ---
  function getSaleStaffData() {
    let saleStaff = staffList.filter((s) => s.role === "Sale-Staff");

    // map data with calculated performance
    let mapped = saleStaff.map((s) => {
      const totalClose = s.salaryHistory.reduce((acc, h) => acc + h.totalCloseOrder, 0);
      const totalDist = s.salaryHistory.reduce((acc, h) => acc + h.totalDistributionOrder, 0);
      const closingRate = totalDist > 0 ? totalClose / totalDist : 0;

      const countAttendanceData = countAttendance(s.attendance);
      const diligence = countAttendanceData.onTime;
      const bonus = s.salaryHistory[0]?.bonus || 0;

      return {
        ...s,
        totalClose,
        totalDist,
        closingRate,
        diligence,
        workLate: countAttendanceData.late,
        workAbsent: countAttendanceData.absent,
      };
    });

    // apply sorting
    if (sortField) {
      mapped.sort((a, b) => {
        if (sortField === "closingRate") {
          return sortOrder === "asc" ? a.closingRate - b.closingRate : b.closingRate - a.closingRate;
        } else if (sortField === "diligence") {
          return sortOrder === "asc" ? a.diligence - b.diligence : b.diligence - a.diligence;
        }
        return 0;
      });
    }

    return mapped;
  }

  const saleStaffData = getSaleStaffData();

  const today = new Date();
  const currentMonthNumber = today.getMonth(); // Returns a number from 0 to 11
  const currentYearNumber = today.getFullYear();

  let attendance: EmployeeAttendanceType[] = [];
  let dailyRecord: DailyRecordType[] = [];
  fullUserData.salaryHistory.forEach((historyData: SalaryHistoryType) => {
    attendance.push(...historyData.attendance);
    dailyRecord.push(...historyData.dailyRecords);
  });

  const timeFormat = `${currentYearNumber}-0${(currentMonthNumber + 1)}`;
  // console.log('timeFormat', timeFormat);
  const currentMonthData = fullUserData.salaryHistory.find((data) => data.time === timeFormat);

  const bonus = currentMonthData ? currentMonthData.bonus.value : 0;
  const fine = currentMonthData ? currentMonthData.fine.value : 0;
  const overtimeValue = currentMonthData ? currentMonthData.overtime.value : 0;
  const baseSalary = currentMonthData ? currentMonthData.baseSalary : 0;
  const salaryPerDay = baseSalary / workingDayPerMonth;
  const totalWorkDay = (saleStaffData[0]?.diligence || 0) + (saleStaffData[0]?.workLate || 0);
  const overtimeValueFix = Math.round(overtimeValue / 1000) * 1000;
  const estPaidSalary = bonus - fine + overtimeValueFix + salaryPerDay * totalWorkDay;
  // console.log('estPaidSalary ', estPaidSalary );
  // const estPaidSalaryFix = ;  Math.round(((salaryPerDay * totalWorkDay) / 1000) * 1000);
  return (
    <div className={cx("user-page-main")}>
      <StaffHeartbeat />
      <div className={cx("header-logout")}>
        <div>
          <h4 style={{ color: "#005fec" }}>Hồ sơ cá nhân</h4>
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          <h4><StaffTracking staffID={fullUserData.staffID}/></h4>
          <h4 style={{ cursor: "pointer", color: "#005fec" }} onClick={() => navigate("/quan-li-don-hang")}>
            Trang Quản lí đơn
          </h4>
          <h4 onClick={() => handleLogout()} style={{ cursor: "pointer" }}>
            Đăng xuất
          </h4>
        </div>
      </div>

      {showAccountForm && user && (
        <div className={cx("wrap-change-pass")}>
          <div className={cx("form-container")}>
            <h5>Đổi mật khẩu</h5>
            <div style={{ color: "red" }}>{error}</div>
            <input type="password" placeholder="Mật khẩu cũ" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Nhập lại mật khẩu mới" value={repeatPass} onChange={(e) => setRepeatPass(e.target.value)} />
            <div className={cx("btn-actions")}>
              <button className={cx("save")} onClick={() => handleChangePass()}>
                Lưu
              </button>
              <button className={cx("cancel")} onClick={() => setShowAccountForm(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={cx("wrap-info-account")}>
        {user && (
          <div className={cx("profile-card", "card1")}>
            <div className={cx("header")}>
              <div className={cx("title")}>Thông tin tài khoản</div>
              <button
                className={cx("btn-edit")}
                onClick={() => {
                  // open small modal/form for changing password or role
                  setShowAccountForm(true);
                }}
              >
                ✏️ Đổi mật khẩu
              </button>
            </div>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Quyền:</strong> {user.staffRole}
            </p>
            <p>
              <strong>Ngày đăng kí:</strong> {user.registeredDate}
            </p>
          </div>
        )}
        <div className={cx("profile-card", "card2")}>
          <div className={cx("header")}>
            <div className={cx("title")}>Thông tin cá nhân</div>
            <button className={cx("btn-edit")} onClick={() => setIsOpenForm(true)}>
              ✏️ Sửa thông tin
            </button>
          </div>
          <div className={cx("row")}>
            <div className={cx("part")}>
              <strong>Họ tên:</strong> <span>{userData.name}</span>
            </div>
            <div className={cx("part")}>
              <strong>Ngày sinh:</strong> <span>{userData.birthday}</span>
            </div>
          </div>

          <div className={cx("row")}>
            <div>
              <strong>CCCD:</strong> {userData.identityId}
            </div>
            <div>
              <strong>SĐT:</strong> {userData.phone}
            </div>
          </div>
          {/* <div className={cx('row')}>
            <div>
              <strong>Ngày vào làm:</strong> {fullUserData.joinedDate}
            </div>
            <div>
              <strong>Lương cơ bản:</strong> {fullUserData?.salary?.toLocaleString("vi-VN")} đ
            </div>
          </div> */}

          <p>
            <strong>Ngày vào làm:</strong> {fullUserData.joinedDate}
          </p>
          <p>
            <strong>Lương cơ bản:</strong> {fullUserData?.salary?.toLocaleString("vi-VN")} đ
          </p>
          <p>
            <strong>TK ngân hàng:</strong> {fullUserData.bankInfos.bankAccountNumber} - {fullUserData.bankInfos.bankOwnerName}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {userData.address}
          </p>
          <p>
            <strong>Mô tả:</strong> {userData.description}
          </p>
          {/* <p>
            <strong>Email:</strong> {userData.accountLogin}
          </p> */}
        </div>
        <div className={cx("performance-card")}>
          <div className={cx("header")}>
            <div className={cx("title")}>Hiệu suất tháng {(currentMonthNumber + 1)}</div>
          </div>
          <div className={cx("row")}>
            <div>
              <strong>Đơn chốt:</strong> {saleStaffData[0]?.totalClose || 0}
            </div>
            <div>
              <strong>Đơn nhận:</strong> {saleStaffData[0]?.totalDist || 0}
            </div>
            <div>
              <strong>Tỷ lệ chốt:</strong> {(saleStaffData[0]?.closingRate * 100).toFixed(1) || 0}%
            </div>
          </div>

          <div className={cx("row")}>
            <div>
              <strong>Đi muộn:</strong> {saleStaffData[0]?.workLate || 0}
            </div>
            <div>
              <strong>Vắng:</strong> {saleStaffData[0]?.workAbsent || 0}
            </div>
            <div>
              <strong>Đúng giờ:</strong> {saleStaffData[0]?.diligence || 0}/26
            </div>
          </div>

          <div className={cx("row")}>
            <div>
              <strong>Chuyên cần:</strong> {saleStaffData && saleStaffData[0]?.diligence > 24 ? deligenceBonus.toLocaleString("vi-VN") : 0} ₫
            </div>
            <div>
              <strong>Thưởng:</strong> {(currentMonthData?.bonus.value || 0).toLocaleString("vi-VN")} đ
            </div>
            <div>
              <strong>Giảm trừ:</strong> {(currentMonthData?.fine.value || 0).toLocaleString("vi-VN")} đ
            </div>
          </div>
          <div className={cx("row")}>
            <div>
              <strong>Tăng ca:</strong> {currentMonthData?.overtime.totalTime || 0} giờ
            </div>
            <div>
              <strong>Tạm tính:</strong> { (Math.round((currentMonthData?.overtime.value || 0)/1000)*1000).toLocaleString("vi-VN")} đ
            </div>
            <div>
              <strong></strong> --
            </div>
          </div>
          <div className={cx("horizontal-line")}></div>
          <div>
            <strong>Lương tạm tính:</strong> {(Math.round(estPaidSalary / 1000) * 1000).toLocaleString("vi-VN")} đ
          </div>
        </div>
      </div>

      <div className={cx("staff-list-info")}>
        <div className={cx("table")}>
          <div className={cx("row", "header")}>
            <div>Vai trò</div>
            <div>Tên</div>
            {/* <div>ID</div> */}
            <div>Thâm niên</div>
            <div>Tổng đơn chốt</div>
            <div>Tổng đơn phân phối</div>
            <div>Tỷ lệ chốt</div>
            {/* <div>Total Revenue</div> */}
            <div>Tổng thưởng</div>
            <div>Tổng giảm trừ</div>
            <div>Tổng tăng ca</div>
            <div>Tổng lương nhận</div>
            {/* <div>Edit</div> */}
          </div>

          {staffList.map((staff, k) => {
            const summary = calculateStaffSummary(staff);
            return (
              <React.Fragment key={k}>
                <div className={cx("row")} onClick={() => setExpandedStaff(expandedStaff === staff.staffID ? null : staff.staffID)}>
                  <div className={cx("role", `${staff.role.toLocaleLowerCase()}`)}>{staff.role}</div>
                  <div className={cx("name")}>{staff.staffInfo.name}</div>
                  {/* <div>{staff.id}</div> */}
                  <div>{calcSeniority(staff.joinedDate)}</div>
                  <div>{summary.totalCloseOrder}</div>
                  <div>{summary.totalDistributionOrder}</div>
                  <div>{summary.rate}</div>
                  {/* <div>{summary.totalRevenue.toLocaleString()} ₫</div> */}
                  <div>{summary.totalBonus.toLocaleString()} ₫</div>
                  <div>{summary.totalFine.toLocaleString()} ₫</div>
                  <div>{summary.totalOvertime.toLocaleString()} ₫</div>
                  <div>{summary.totalSalary.toLocaleString()} ₫</div>
                  {/* <div className={cx("edit-btn")}>
                    <MdModeEdit size={22} />
                  </div> */}
                </div>

                {
                  <div className={cx("expand-box")}>
                    {/* //-- Calender box */}
                    <div className={cx("staff-attendance")}>
                      <AttendanceCalendar attendance={attendance} dailyRecords={dailyRecord} />
                    </div>

                    {/* //-- Box 2: Salary History */}
                    <div className={cx("salary-history-box")}>
                      <h5>💰 Nhật kí lương</h5>
                      <div className={cx("filter-mode")}>
                        <button onClick={() => setFilterMode("all")}>All Time</button>
                        <div>
                          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                              <option key={m} value={m}>
                                {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
                              </option>
                            ))}
                          </select>
                          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                            {Array.from({ length: 6 }, (_, i) => selectedYear - 3 + i).map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                          <button onClick={() => setFilterMode("month")}>Apply</button>
                        </div>
                      </div>
                      <div className={cx("history-list")}>
                        <div className={cx("history-row", "header")}>
                          <div>Thời gian</div>

                          <div>Đơn chốt</div>
                          <div>Đơn phân phối</div>
                          <div>Tỷ lệ chốt</div>
                          {/* <div>Revenue</div> */}
                          <div>Thưởng</div>
                          <div>Giảm trừ</div>
                          <div>Lương CB</div>
                          <div>Tăng ca</div>
                          <div>Lương lĩnh</div>
                          {/* <div>Edit</div> */}
                        </div>
                        {getFilteredHistory(staff).slice().reverse().map((h: SalaryHistoryType, idx) => {
                          const bonus = h.bonus ? h.bonus.value : 0;
                          const fine = h.fine ? h.fine.value : 0;
                          const overtimeValue = h.overtime ? h.overtime.value : 0;

                          const overtimeValueFix = Math.round(overtimeValue / 1000) * 1000;
                          const paidSalary = bonus - fine + h.baseSalary + overtimeValueFix;

                          const closeOrderRate = (h.totalCloseOrder / h.totalDistributionOrder) * 100 || 0;
                          return (
                            <div key={idx} className={cx("history-row")}>
                              <div>{h.time}</div>

                              <div>{h.totalCloseOrder}</div>
                              <div>{h.totalDistributionOrder}</div>
                              {/* <div>{h.totalRevenue.toLocaleString()} ₫</div> */}
                              <div>{closeOrderRate.toFixed(2)}%</div>
                              <div>{h.bonus ? h.bonus.value.toLocaleString() + " ₫" : "-"}</div>
                              <div>{h.fine ? h.fine.value.toLocaleString() + " ₫" : "-"}</div>
                              <div>{h.baseSalary.toLocaleString()} ₫</div>
                              <div>{overtimeValueFix.toLocaleString("vi-VN")} ₫</div>
                              <div>{paidSalary.toLocaleString("vi-VN")} ₫</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                }
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {isOpenForm && (
        <div className={cx("wrap-add-form")}>
          <AddUserInfo
            fullUserData={fullUserData}
            //   setUserData={setUserData}
            setFullUserData={setFullUserData}
            setIsOpenAddForm={setIsOpenForm}
          />
        </div>
      )}
    </div>
  );
}
function countAttendance(attendance: EmployeeAttendanceType[]) {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7); // "YYYY-MM"

  // Filter only current month
  const filtered = attendance.filter((item) => item.date.startsWith(currentMonth));

  // Count each status
  return filtered.reduce(
    (acc, item) => {
      acc[item.checked] = (acc[item.checked] || 0) + 1;
      return acc;
    },
    { onTime: 0, late: 0, absent: 0 }
  );
}
