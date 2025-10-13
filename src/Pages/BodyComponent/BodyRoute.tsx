import { Routes, Route } from "react-router-dom";
import Overview from "./Overview";
import Finance from "./Financial/Finance";
import ProductManage from "./ProductManage/ProductManage";

export default function BodyRoutes() {
  return (
    <Routes>
      <Route path="overview" element={<Overview />} />
      <Route path="finance" element={<Finance />} />
      <Route path="product-manage" element={<ProductManage />} />
      <Route index element={<Overview />} /> {/* Default */}
    </Routes>
  );
}
