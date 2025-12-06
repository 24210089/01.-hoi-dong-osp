// src/features/users/pages/UserListPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Nav,
  Tab,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userService } from "@services";
import { useTable, useDebounce } from "@hooks";
import { UserCard, UserForm, UserFilter } from "../components";
import SearchBox from "@components/common/SearchBox";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import "./UserListPage.css";

const UserListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);

  const table = useTable({
    initialPageSize: 12,
  });

  const debouncedSearch = useDebounce(table.searchTerm, 500);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = table.getTableParams();
      console.log("Fetching users with params:", params);
      const response = await userService.getList(params);
      console.log("User service response:", response);

      if (response.success) {
        setUsers(response.data.items || []);
        table.setTotalItems(response.data.total || 0);
      } else {
        console.error("Failed to fetch users:", response.error);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleView = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.full_name}?`)
    ) {
      try {
        const response = await userService.delete(user.id);
        if (response.success) {
          alert(response.message || "Đã xóa người dùng thành công");
          fetchUsers();
        } else {
          alert(response.error || "Không thể xóa người dùng");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Có lỗi xảy ra khi xóa người dùng");
      }
    }
  };

  const handleResetPassword = (user) => {
    setResetPasswordUser(user);
    setShowResetPassword(true);
  };

  const handleConfirmResetPassword = async () => {
    try {
      await userService.resetPassword(resetPasswordUser.id);
      setShowResetPassword(false);
      setResetPasswordUser(null);
      alert("Mật khẩu mới đã được gửi qua email");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedUser) {
        await userService.update(selectedUser.id, values);
      } else {
        await userService.create(values);
      }
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const usersByRole = {
    admin: (users || []).filter((u) => u.role === "admin"),
    superior_general: (users || []).filter(
      (u) => u.role === "superior_general"
    ),
    superior_provincial: (users || []).filter(
      (u) => u.role === "superior_provincial"
    ),
    superior_community: (users || []).filter(
      (u) => u.role === "superior_community"
    ),
    secretary: (users || []).filter((u) => u.role === "secretary"),
    viewer: (users || []).filter((u) => u.role === "viewer"),
  };

  const activeUsers = (users || []).filter((u) => u.status === "active");
  const inactiveUsers = (users || []).filter((u) => u.status === "inactive");

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

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Quản lý Người dùng"
        items={[{ label: "Quản lý Người dùng" }]}
      />

      {/* Statistics */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Tổng số</small>
                  <h4 className="mb-0">{(users || []).length}</h4>
                </div>
                <div className="stat-icon bg-primary">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Đang hoạt động</small>
                  <h4 className="mb-0">{activeUsers.length}</h4>
                </div>
                <div className="stat-icon bg-success">
                  <i className="fas fa-user-check"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Quản trị viên</small>
                  <h4 className="mb-0">{usersByRole.admin.length}</h4>
                </div>
                <div className="stat-icon bg-danger">
                  <i className="fas fa-user-shield"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Đã khóa</small>
                  <h4 className="mb-0">{inactiveUsers.length}</h4>
                </div>
                <div className="stat-icon bg-secondary">
                  <i className="fas fa-user-lock"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search & Filter */}
      <Row className="g-3 mb-4">
        <Col md={8}>
          <SearchBox
            value={table.searchTerm}
            onChange={table.handleSearch}
            placeholder="Tìm kiếm theo tên, email, tên đăng nhập..."
          />
        </Col>
        <Col md={4}>
          <UserFilter
            filters={table.filters}
            onFilterChange={table.updateFilters}
            onClearFilters={table.clearFilters}
          />
        </Col>
      </Row>

      {/* Content */}
      {(users || []).length > 0 ? (
        <Tab.Container defaultActiveKey="all">
          <Card>
            <Card.Header className="bg-white">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="all">
                    <i className="fas fa-list me-2"></i>
                    Tất cả ({(users || []).length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="admin">
                    <i className="fas fa-user-shield me-2"></i>
                    Quản trị ({usersByRole.admin.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="superior_general">
                    <i className="fas fa-crown me-2"></i>
                    Tổng quyền ({usersByRole.superior_general.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="superior_provincial">
                    <i className="fas fa-user-tie me-2"></i>
                    Tỉnh ({usersByRole.superior_provincial.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="superior_community">
                    <i className="fas fa-users me-2"></i>
                    Cộng đoàn ({usersByRole.superior_community.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="secretary">
                    <i className="fas fa-user-edit me-2"></i>
                    Thư ký ({usersByRole.secretary.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="viewer">
                    <i className="fas fa-eye me-2"></i>
                    Xem ({usersByRole.viewer.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="all">
                  <Row className="g-4">
                    {users.map((user) => (
                      <Col key={user.id} xs={12} sm={6} lg={4} xl={3}>
                        <UserCard
                          user={user}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onResetPassword={handleResetPassword}
                        />
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
                {Object.entries(usersByRole).map(([role, roleUsers]) => (
                  <Tab.Pane key={role} eventKey={role}>
                    <Row className="g-4">
                      {roleUsers.map((user) => (
                        <Col key={user.id} xs={12} sm={6} lg={4} xl={3}>
                          <UserCard
                            user={user}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onResetPassword={handleResetPassword}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      ) : (
        <Card>
          <Card.Body className="text-center py-5">
            <i
              className="fas fa-users text-muted mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5>Chưa có người dùng</h5>
            <p className="text-muted">Thêm người dùng đầu tiên để bắt đầu</p>
            <Button variant="primary" onClick={handleAdd}>
              <i className="fas fa-plus me-2"></i>
              Thêm Người dùng
            </Button>
          </Card.Body>
        </Card>
      )}

      {/* User Form Modal */}
      <UserForm
        show={showForm}
        onHide={() => setShowForm(false)}
        user={selectedUser}
        onSubmit={handleSubmit}
      />

      {/* Reset Password Modal */}
      <Modal
        show={showResetPassword}
        onHide={() => setShowResetPassword(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-key me-2"></i>
            Đặt lại mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng{" "}
            <strong>{resetPasswordUser?.full_name}</strong>?
          </p>
          <p className="text-muted mb-0">
            Mật khẩu mới sẽ được tạo tự động và gửi qua email:{" "}
            <strong>{resetPasswordUser?.email}</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowResetPassword(false)}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleConfirmResetPassword}>
            <i className="fas fa-check me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserListPage;
