// src/utils/permissions.js

import { USER_ROLES } from "./constants";

/**
 * Check if user has permission
 * @param {object} user
 * @param {string|string[]} requiredRoles
 * @returns {boolean}
 */
export const hasPermission = (user, requiredRoles) => {
  if (!user) return false;
  if (!requiredRoles || requiredRoles.length === 0) return true;

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(user.role);
};

/**
 * Check if user is admin
 * @param {object} user
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.role === USER_ROLES.ADMIN;
};

/**
 * Check if user is superior
 * @param {object} user
 * @returns {boolean}
 */
export const isSuperior = (user) => {
  return [
    USER_ROLES.ADMIN,
    USER_ROLES.SUPERIOR_GENERAL,
    USER_ROLES.SUPERIOR_COMMUNITY,
  ].includes(user?.role);
};

/**
 * Check if user can edit sister
 * @param {object} user
 * @param {object} sister
 * @returns {boolean}
 */
export const canEditSister = (user, sister) => {
  if (!user || !sister) return false;

  // Admin can edit all
  if (isAdmin(user)) return true;

  // Superior can edit sisters in their community
  if (isSuperior(user)) {
    return user.community_id === sister.community_id;
  }

  return false;
};

/**
 * Check if user can delete sister
 * @param {object} user
 * @returns {boolean}
 */
export const canDeleteSister = (user) => {
  return isAdmin(user);
};

/**
 * Check if user can view reports
 * @param {object} user
 * @returns {boolean}
 */
export const canViewReports = (user) => {
  return isSuperior(user);
};

/**
 * Check if user can manage users
 * @param {object} user
 * @returns {boolean}
 */
export const canManageUsers = (user) => {
  return isAdmin(user);
};

/**
 * Get allowed actions for user
 * @param {object} user
 * @returns {object}
 */
export const getAllowedActions = (user) => {
  return {
    canCreate: isSuperior(user),
    canEdit: isSuperior(user),
    canDelete: isAdmin(user),
    canViewReports: isSuperior(user),
    canManageUsers: isAdmin(user),
    canExport: isSuperior(user),
    canImport: isAdmin(user),
  };
};
