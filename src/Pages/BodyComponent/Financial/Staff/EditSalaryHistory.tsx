import React, { useState } from "react";
import axios from "axios";
import styles from "./EditSalaryHistory.module.scss";
import type { SalaryHistoryType, StaffDataType } from "../DataTest/DataForStaffSalary";

interface EditSalaryHistoryProps {
  staffId: string; // use staffId to know who we edit
  salary: SalaryHistoryType;
  setIsOpenEditSalary: (value: boolean) => void;
}

const EditSalaryHistory: React.FC<EditSalaryHistoryProps> = ({
  staffId,
  salary,
  setIsOpenEditSalary,
}) => {
  const [formData, setFormData] = useState<SalaryHistoryType>(salary);

  const handleChange = (field: keyof SalaryHistoryType, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:6000/api-v1/staff/action=edit-salary", {
        staffId,
        salary: formData,
      });
      alert("Salary history updated successfully!");
      setIsOpenEditSalary(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update salary history.");
    }
  };

  return (
    <div className={styles["edit-salary-container"]}>
      <form className={styles["edit-salary-form"]} onSubmit={handleSubmit}>
        <h3>Edit Salary – {formData.time}</h3>

        <label>Base Salary</label>
        <input
          type="number"
          value={formData.baseSalary}
          onChange={(e) => handleChange("baseSalary", Number(e.target.value))}
        />

        <label>Total Close Orders</label>
        <input
          type="number"
          value={formData.totalCloseOrder}
          onChange={(e) => handleChange("totalCloseOrder", Number(e.target.value))}
        />

        <label>Total Distribution Orders</label>
        <input
          type="number"
          value={formData.totalDistributionOrder}
          onChange={(e) => handleChange("totalDistributionOrder", Number(e.target.value))}
        />

        <label>Total Revenue</label>
        <input
          type="number"
          value={formData.totalRevenue}
          onChange={(e) => handleChange("totalRevenue", Number(e.target.value))}
        />

        <label>Bonus</label>
        <input
          type="number"
          value={formData.bonus?.value || 0}
          onChange={(e) =>
            handleChange("bonus", {
              ...formData.bonus,
              value: Number(e.target.value),
              note: formData.bonus?.note || "",
              time: formData.bonus?.time || formData.time,
            })
          }
        />

        <label>Fine</label>
        <input
          type="number"
          value={formData.fine?.value || 0}
          onChange={(e) =>
            handleChange("fine", {
              ...formData.fine,
              value: Number(e.target.value),
              note: formData.fine?.note || "",
              time: formData.fine?.time || formData.time,
            })
          }
        />

        <label>Paid?</label>
        <input
          type="checkbox"
          checked={!!formData.isPaid}
          onChange={(e) => handleChange("isPaid", e.target.checked)}
        />

        <div className={styles["form-actions"]}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsOpenEditSalary(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSalaryHistory;
