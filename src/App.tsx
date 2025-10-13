import "./App.css";
import MainPage from "./Pages/MainPage";
import { Routes, Route, useLocation } from "react-router-dom";
import ShopOrders from "./LandingOrders/ShopOrders";
import Login from "./AuthPage/Login";
import Register from "./AuthPage/Register";
import ProtectedRoute from "./AuthPage/ProtectedRoute";
import LandingManagement from "./LandingOrders/LandingManagement";
import LandingManagement_v2 from "./LandingOrders/LandingManagement2";
import UserPage from "./AuthPage/UserPage";
import GlobalSocket from "./ultilitis/GlobalSocket";
import ProductManage from "./Pages/BodyComponent/ProductManage/ProductManage";
import Finance from "./Pages/BodyComponent/Financial/Finance";
import ProductTable_v2 from "./Pages/BodyComponent/ProductManage/ProductDetails/ProductTable_v2";
import NoRoute from "./ultilitis/NoRoute";
import StaffMenu from "./Pages/MenuComponent/StaffMenu";
import StaffMenuLayout from "./Pages/MenuComponent/StaffMenuLayout";
function App() {
  const location = useLocation();

  // Routes where StaffMenu should NOT appear
  const hideStaffMenuOn = ["/login", "/register", "/home"];

  // Check if current path starts with any excluded route
  const shouldShowStaffMenu = !hideStaffMenuOn.some((path) => location.pathname.startsWith(path));
  return (
    <div className="app-main">
      <GlobalSocket />

      {/* ✅ Only show StaffMenu when allowed */}
      {shouldShowStaffMenu && <StaffMenu />}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/home/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quan-li-don-hang/*"
          element={
            <ProtectedRoute>
              <StaffMenuLayout>
                <LandingManagement_v2 />
              </StaffMenuLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ho-so-ca-nhan"
          element={
            <ProtectedRoute>
              <StaffMenuLayout>
                <UserPage />
              </StaffMenuLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/danh-sach-san-pham"
          element={
            <ProtectedRoute>
              <StaffMenuLayout>
                <ProductTable_v2 />
              </StaffMenuLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NoRoute />} />
      </Routes>
    </div>
  );
}

export default App;
