// src/services/permissionService.js

import api from "./api";

const permissionService = {
  /**
   * Get all roles
   * @returns {Promise}
   */
  getRoles: async () => {
    try {
      const response = await api.get("/roles");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi tải danh sách vai trò",
      };
    }
  },

  /**
   * Get all permissions
   * @returns {Promise}
   */
  getPermissions: async () => {
    try {
      const response = await api.get("/permissions");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi tải danh sách quyền",
      };
    }
  },

  /**
   * Get role permissions mapping
   * @returns {Promise}
   */
  getRolePermissions: async () => {
    try {
      const response = await api.get("/role-permissions");
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi tải phân quyền",
      };
    }
  },

  /**
   * Assign permission to role
   * @param {string|number} roleId
   * @param {string|number} permissionId
   * @returns {Promise}
   */
  assignPermission: async (roleId, permissionId) => {
    try {
      const response = await api.post("/role-permissions", {
        role_id: roleId,
        permission_id: permissionId,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi gán quyền",
      };
    }
  },

  /**
   * Revoke permission from role
   * @param {string|number} roleId
   * @param {string|number} permissionId
   * @returns {Promise}
   */
  revokePermission: async (roleId, permissionId) => {
    try {
      await api.delete("/role-permissions", {
        data: {
          role_id: roleId,
          permission_id: permissionId,
        },
      });
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi thu hồi quyền",
      };
    }
  },

  /**
   * Update role permissions (bulk update)
   * @param {string|number} roleId
   * @param {Array} permissionIds
   * @returns {Promise}
   */
  updateRolePermissions: async (roleId, permissionIds) => {
    try {
      const response = await api.put(`/roles/${roleId}/permissions`, {
        permissions: permissionIds,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi cập nhật quyền",
      };
    }
  },
};

export default permissionService;
