// src/guards/RoleGuard.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { usePermission } from "@hooks";
import { ForbiddenPage } from "@pages/errors";

/**
 * RoleGuard - Protect routes based on user roles
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string|string[]} props.roles - Required role(s)
 * @param {string} props.redirectTo - Redirect path if no role
 * @param {boolean} props.showForbidden - Show 403 page instead of redirect
 */
const RoleGuard = ({
  children,
  roles,
  redirectTo = "/dashboard",
  showForbidden = true,
}) => {
  const { hasAnyRole } = usePermission();

  const rolesArray = Array.isArray(roles) ? roles : [roles];
  const hasRequiredRole = hasAnyRole(rolesArray);

  if (!hasRequiredRole) {
    return showForbidden ? (
      <ForbiddenPage />
    ) : (
      <Navigate to={redirectTo} replace />
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
