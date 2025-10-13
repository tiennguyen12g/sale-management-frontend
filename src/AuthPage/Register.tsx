import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";

const cx = classNames.bind(styles);
import { Register_API } from "../configs/api";
import type { StaffRole } from "../zustand/staffStore";
import { SalaryByPosition } from "../zustand/staffStore";
import { AddStaff_API } from "../configs/api";
export default function Register() {
  const [username, setUsername] = useState("none");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [staffRole, setStaffRole] = useState<StaffRole>("Sale-Staff");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (repeatPassword !== password) {
      // setError("Mật khẩu nhập lại không khớp!")
      return;
    }

    try {

      const userInfos = {
        username, email, password, staffRole, isCreateProfile: false, 
        registeredDate: new Date().toISOString().split("T")[0],
      }
      const res = await fetch(Register_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfos),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "User already exists") {
          setError("Email đã đăng kí");
          return;
        }

        setError("Đăng kí lỗi");
        return;
      }

      alert("Đăng kí thành công! Hãy đăng nhập.");
      navigate("/login"); // ✅ redirect to login page
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (repeatPassword !== password) {
      setError("Mật khẩu nhập lại không khớp!");
    } else {
      setError("");
    }
  }, [password, repeatPassword]);

  const initialForm = {
    role: staffRole,
    staffID: "",
    salary: SalaryByPosition[staffRole],
    joinedDate: new Date().toISOString().split("T")[0],
    staffInfo: {
      name: "",
      birthday: "",
      address: "",
      phone: "",
      relationshipStatus: "",
      religion: "",
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
  };

  // const handleAddStaff = async () => {
  //   try {
  //     // const payload = {
  //     //   role: staffForm.role,
  //     //   salary: staffForm.baseSalary,
  //     //   joinedDate: staffForm.joinedDate,
  //     //   diligenceCount: staffForm.diligenceCount,
  //     //   staffID: `${toSlug(staffForm.name)}-${staffForm.phone}`,
  //     //   staffInfo: {
  //     //     name: staffForm.name,
  //     //     birthday: staffForm.birthday,
  //     //     address: staffForm.address,
  //     //     phone: staffForm.phone,
  //     //     relationshipStatus: staffForm.relationshipStatus,
  //     //     religion: staffForm.religion,
  //     //     description: staffForm.description,
  //     //     identityId: staffForm.identityId,
  //     //     accountLogin: staffForm.accountLogin,
  //     //   },
  //     //   bankInfos: {
  //     //     bankAccountNumber: staffForm.bankAccountNumber,
  //     //     bankOwnerName: staffForm.bankOwnerName,
  //     //   },
  //     //   salaryHistory: [],
  //     //   attendance: [],
  //     // };

  //     const res = await fetch(AddStaff_API, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json", ...getAuthHeader() },
  //       body: JSON.stringify(in),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       addStaff(data); // ✅ update Zustand store
  //       alert("Staff added successfully!");
  //     } else {
  //       alert("Error: " + data.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert("Error adding staff");
  //   }
  // };

  return (
    <div className={cx("register-main")}>
      <form onSubmit={handleRegister} className={cx("register-form")}>
        <h2>Đăng kí tài khoản</h2>

        {error && <div className={cx("error")}>{error}</div>}

        <div className={cx("form-group")}>
          <label>Tên nickname:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ví dụ: tiennguyen12g, hung95 ..."
            required
          />
        </div>

        <div className={cx("form-group")}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className={cx("form-group")}>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className={cx("form-group")}>
          <label>Nhập lại Password:</label>
          <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
        </div>
        <div className={cx("form-group")}>
          <label>Vai trò:</label>
          <select value={staffRole} onChange={(e) => setStaffRole(e.target.value as StaffRole)}>
            <option value="Sale-Staff">Nhân viên Sale</option>
            <option value="Packer">Nhân viên đóng gói</option>
            <option value="Manager">Nhân viên quản lí</option>
            {/* <option value="director">Admin</option> */}
          </select>
        </div>

        <button type="submit" className={cx("btn")}>
          Đăng kí
        </button>

        <p className={cx("switch-auth")}>
          Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </form>
    </div>
  );
}
