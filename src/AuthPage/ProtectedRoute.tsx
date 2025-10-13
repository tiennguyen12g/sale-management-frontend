import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
    requiredRole?: string; // optional, only check if provided

}

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     // If no token, redirect to login
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// }
export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.staffRole !== requiredRole) {
    // user is logged in but not authorized
    return <Navigate to="/landing" replace />;
  }

   return <>{children}</>;
}