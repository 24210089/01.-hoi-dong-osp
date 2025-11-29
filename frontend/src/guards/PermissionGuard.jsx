// src/guards/PermissionGuard.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { usePermission } from "@hooks";
import { ForbiddenPage } from "@pages/errors";

/**
 * PermissionGuard - Protect routes based on permissions
 * @param {object} props
 * @param {React.ReactNode} props.children - Child components
 * @param {string|string[]} props.permissions - Required permission(s)
 * @param {string|string[]} props.roles - Required role(s)
 * @param {boolean} props.requireAll - Require all permissions (default: false)
 * @param {string} props.redirectTo - Redirect path if no permission
 * @param {boolean} props.showForbidden - Show 403 page instead of redirect
 */
const PermissionGuard = ({
  children,
  permissions,
  roles,
  requireAll = false,
  redirectTo = "/dashboard",
  showForbidden = true,
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  } = usePermission();

  // Check role-based access
  if (roles) {
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    const hasRequiredRole = hasAnyRole(rolesArray);

    if (!hasRequiredRole) {
      return showForbidden ? (
        <ForbiddenPage />
      ) : (
        <Navigate to={redirectTo} replace />
      );
    }
  }

  // Check permission-based access
  if (permissions) {
    const permissionsArray = Array.isArray(permissions)
      ? permissions
      : [permissions];

    let hasRequiredPermission;
    if (requireAll) {
      hasRequiredPermission = hasAllPermissions(permissionsArray);
    } else {
      hasRequiredPermission = hasAnyPermission(permissionsArray);
    }

    if (!hasRequiredPermission) {
      return showForbidden ? (
        <ForbiddenPage />
      ) : (
        <Navigate to={redirectTo} replace />
      );
    }
  }

  // Render children if authorized
  return <>{children}</>;
};

export default PermissionGuard;
