import { useState, useMemo, useEffect } from "react";

type FilterMode = "all" | "month" | "year";

// T now supports optional batchCode
export default function useFilterAndPagination<
  T extends { time: string; productName: string; batchCode?: string }
>(data: T[], itemsPerPage = 5) {
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [productName, setProductName] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const years = Array.from({ length: 6 }, (_, i) => selectedYear - 3 + i);

  /* 🔹 Reset page when filters change */
  useEffect(() => {
    setCurrentPage(1);
  }, [filterMode, selectedMonth, selectedYear, productName, data, batchCode]);

  // Filtering
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const date = new Date(item.time);
      const matchProduct = item.productName.toLowerCase().includes(productName.toLowerCase());
      const matchBatch =
        batchCode.trim() === "" ||
        (item.batchCode?.toLowerCase().includes(batchCode.toLowerCase()) ?? false);

      if (filterMode === "month") {
        return (
          matchProduct &&
          matchBatch &&
          date.getMonth() + 1 === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      }
      if (filterMode === "year") {
        return matchProduct && matchBatch && date.getFullYear() === selectedYear;
      }
      return matchProduct && matchBatch;
    });
  }, [data, filterMode, selectedMonth, selectedYear, productName, batchCode]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) =>
    setCurrentPage(Math.min(Math.max(1, page), totalPages));

  return {
    filterMode,
    setFilterMode,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    years,
    productName,
    setProductName,
    batchCode,
    setBatchCode, // 🔹 expose setter
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
  };
}
