import "./App.css";
import { useEffect } from "react";
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
import PageMessage from "./Pages/BodyComponent/FacebookAPI/PageMessage";
import { FacebookSDKLoader } from "./Pages/BodyComponent/FacebookAPI/FacebookSDKLoader";
import TestUI from "./zustand/test";
import InitialFetchData from "./ultilitis/InitialFetchData";
import { useAuthStore } from "./zustand/authStore";
import AdsAccountLayout from "./Pages/BodyComponent/AdsAccount/AdsAaccount";
import NewLayout from "./NewLayout/NewLayout";
import AdsAccountManagement from "./Pages/BodyComponent/Financial/AdsCosts/AdsAccountManagement";
import SettingPage from "./Pages/SettingPage/SettingPage";
import NewLayoutTemplate from "./NewLayout/NewLayoutTemplate";
import { useSettingStore } from "./zustand/settingStore";
function App() {
  const location = useLocation();

  // Routes where StaffMenu should NOT appear
  const hideStaffMenuOn = ["/login", "/register", "/home"];

  // Check if current path starts with any excluded route
  const shouldShowStaffMenu = !hideStaffMenuOn.some((path) => location.pathname.startsWith(path));

  const { yourStaffId, setYourStaffId, yourStaffInfo, setYourStaffInfo} = useAuthStore();
  const {settings, initSettings,} = useSettingStore();

  // ✅ Only run once on mount to initialize yourStaffId from localStorage
  useEffect(() => {
    if (!yourStaffId || !yourStaffInfo) {
      const stored = localStorage.getItem("yourStaffInfo");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.staffID) {
            setYourStaffId(parsed.staffID);
            setYourStaffInfo(parsed)
            console.log("✅ Loaded yourStaffId from localStorage:", parsed.staffID);
          }
        } catch (err) {
          console.warn("⚠️ Failed to parse yourStaffInfo:", err);
        }
      }
    }
  }, [yourStaffId, setYourStaffId]);
  useEffect(() => {
    console.log("out", settings);
    if (!settings) {
      console.log("hdd", settings);
      const settingStore = localStorage.getItem("settings");
      if (settingStore) {
        try {
          const parsed = JSON.parse(settingStore);
          if (parsed) {
            initSettings(parsed);
            console.log("✅ Loaded yourStaffId from localStorage:", parsed);
          }
        } catch (err) {
          console.warn("⚠️ Failed to parse settings:", err);
        }
      }
    }
  }, [settings, initSettings]);

  return (
    <div className="app-main">
      {/* <InitialFetchData /> */}
      <GlobalSocket />

      <FacebookSDKLoader appId="2051002559051142" />

      {/* ✅ Only show StaffMenu when allowed */}
      {/* {shouldShowStaffMenu && <StaffMenu />} */}

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/new-layout" element={<NewLayout />}/> */}

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
              <NewLayout>
                <NewLayoutTemplate />
              </NewLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ho-so-ca-nhan"
          element={
            <ProtectedRoute>
              <NewLayout>
                <UserPage />
              </NewLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/danh-sach-san-pham"
          element={
            <ProtectedRoute>
              <NewLayout>
                <ProductTable_v2 />
              </NewLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tin-nhan-page"
          element={
            <ProtectedRoute>
              <NewLayout>
                <PageMessage />
                {/* <TestUI /> */}
              </NewLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tai-khoan-ads"
          element={
            <ProtectedRoute>
              <NewLayout>
                <AdsAccountManagement />
                {/* <TestUI /> */}
              </NewLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cai-dat"
          element={
            <ProtectedRoute>
              <NewLayout>
                <SettingPage />
              </NewLayout>
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
