// src/features/users/pages/PermissionsPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import { permissionService } from "@services";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import "./PermissionsPage.css";

const PermissionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permissionsRes, rolePermissionsRes] = await Promise.all([
        permissionService.getRoles(),
        permissionService.getPermissions(),
        permissionService.getRolePermissions(),
      ]);

      if (rolesRes.success) setRoles(rolesRes.data);
      if (permissionsRes.success) setPermissions(permissionsRes.data);
      if (rolePermissionsRes.success)
        setRolePermissions(rolePermissionsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (roleId, permissionId, checked) => {
    try {
      if (checked) {
        await permissionService.assignPermission(roleId, permissionId);
      } else {
        await permissionService.revokePermission(roleId, permissionId);
      }
      fetchData();
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };

  const hasPermission = (roleId, permissionId) => {
    return rolePermissions[roleId]?.includes(permissionId) || false;
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: "danger",
      manager: "primary",
      staff: "info",
      viewer: "secondary",
    };
    return badges[role] || "secondary";
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, permission) => {
    const module = permission.module || "Khác";
    if (!acc[module]) acc[module] = [];
    acc[module].push(permission);
    return acc;
  }, {});

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Trang chủ", link: "/dashboard" },
          { label: "Người dùng", link: "/users" },
          { label: "Phân quyền" },
        ]}
      />

      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-1">Quản lý Phân quyền</h2>
        <p className="text-muted mb-0">Phân quyền truy cập cho từng vai trò</p>
      </div>

      {/* Roles Overview */}
      <Row className="g-3 mb-4">
        {roles.map((role) => (
          <Col key={role.id} md={3}>
            <Card className="role-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Badge bg={getRoleBadge(role.key)} className="px-3 py-2">
                    {role.name}
                  </Badge>
                  <span className="text-muted">
                    {role.user_count || 0} người
                  </span>
                </div>
                <p className="text-muted mb-0 small">{role.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Permissions Matrix */}
      <Card className="permissions-card">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-shield-alt me-2"></i>
            Ma trận phân quyền
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table className="permissions-table mb-0">
              <thead>
                <tr>
                  <th className="module-column">Module / Quyền</th>
                  {roles.map((role) => (
                    <th key={role.id} className="text-center role-column">
                      <Badge bg={getRoleBadge(role.key)}>{role.name}</Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionsByModule).map(
                  ([module, modulePermissions]) => (
                    <React.Fragment key={module}>
                      <tr className="module-row">
                        <td colSpan={roles.length + 1}>
                          <strong>
                            <i className="fas fa-folder me-2"></i>
                            {module}
                          </strong>
                        </td>
                      </tr>
                      {modulePermissions.map((permission) => (
                        <tr key={permission.id}>
                          <td className="permission-name">
                            <div className="d-flex align-items-center">
                              <i
                                className={`fas fa-${
                                  permission.icon || "key"
                                } text-muted me-2`}
                              ></i>
                              <div>
                                <div>{permission.name}</div>
                                {permission.description && (
                                  <small className="text-muted">
                                    {permission.description}
                                  </small>
                                )}
                              </div>
                            </div>
                          </td>
                          {roles.map((role) => (
                            <td key={role.id} className="text-center">
                              <Form.Check
                                type="checkbox"
                                checked={hasPermission(role.id, permission.id)}
                                onChange={(e) =>
                                  handlePermissionChange(
                                    role.id,
                                    permission.id,
                                    e.target.checked
                                  )
                                }
                                disabled={role.key === "admin"} // Admin has all permissions
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Info Alert */}
      <Card className="mt-4 border-info">
        <Card.Body>
          <div className="d-flex align-items-start">
            <i className="fas fa-info-circle text-info me-3 mt-1"></i>
            <div>
              <h6 className="mb-2">Lưu ý về phân quyền</h6>
              <ul className="mb-0 small">
                <li>
                  Quản trị viên (Admin) có toàn quyền truy cập tất cả chức năng
                </li>
                <li>Thay đổi phân quyền sẽ có hiệu lực ngay lập tức</li>
                <li>
                  Người dùng cần đăng xuất và đăng nhập lại để cập nhật quyền
                  mới
                </li>
                <li>Hãy cẩn thận khi phân quyền để tránh lỗi bảo mật</li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PermissionsPage;
