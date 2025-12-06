// src/features/users/components/UserCard/UserCard.jsx

import React from "react";
import { Card, Badge } from "react-bootstrap";
import { formatDate } from "@utils";
import "./UserCard.css";

const UserCard = ({ user, onView, onEdit, onDelete, onResetPassword }) => {
  const getRoleBadge = (role) => {
    const roles = {
      admin: { bg: "danger", label: "Quản trị viên" },
      superior_general: { bg: "danger", label: "Bề trên Tổng quyền" },
      superior_provincial: { bg: "primary", label: "Bề trên Tỉnh" },
      superior_community: { bg: "info", label: "Bề trên Cộng đoàn" },
      secretary: { bg: "success", label: "Thư ký" },
      viewer: { bg: "secondary", label: "Xem" },
    };
    return roles[role] || { bg: "secondary", label: role };
  };

  const getStatusBadge = (status) => {
    return status === "active"
      ? { bg: "success", label: "Đang hoạt động" }
      : { bg: "secondary", label: "Đã khóa" };
  };

  const roleBadge = getRoleBadge(user.role);
  const statusBadge = getStatusBadge(user.status);

  return (
    <Card className="user-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.full_name} />
            ) : (
              <div className="avatar-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
          <div className="d-flex gap-2">
            <Badge bg={roleBadge.bg}>{roleBadge.label}</Badge>
            <Badge bg={statusBadge.bg}>{statusBadge.label}</Badge>
          </div>
        </div>

        <div className="text-center mb-3">
          <h6 className="user-name mb-1">{user.full_name}</h6>
          <p className="user-username text-muted mb-2">@{user.username}</p>
        </div>

        <div className="user-details">
          {user.email && (
            <div className="detail-item">
              <i className="fas fa-envelope text-primary me-2"></i>
              <span className="text-truncate">{user.email}</span>
            </div>
          )}

          {user.phone && (
            <div className="detail-item">
              <i className="fas fa-phone text-success me-2"></i>
              <span>{user.phone}</span>
            </div>
          )}

          {user.last_login && (
            <div className="detail-item">
              <i className="fas fa-clock text-info me-2"></i>
              <span className="text-muted">
                Đăng nhập: {formatDate(user.last_login)}
              </span>
            </div>
          )}
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-top">
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary flex-grow-1"
            onClick={() => onView(user)}
          >
            <i className="fas fa-eye me-1"></i>
            Xem
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => onEdit(user)}
            title="Chỉnh sửa"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-warning"
            onClick={() => onResetPassword(user)}
            title="Đặt lại mật khẩu"
          >
            <i className="fas fa-key"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(user)}
            title="Xóa"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default UserCard;
