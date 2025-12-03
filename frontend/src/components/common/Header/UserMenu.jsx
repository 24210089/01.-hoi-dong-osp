import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // If user has password field, it's form data - clear localStorage and redirect
  if (user && user.password !== undefined) {
    console.error("❌ UserMenu received form data instead of user data!", user);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }

  // If user is null/undefined, show minimal UI
  if (!user) {
    return (
      <Dropdown ref={dropdownRef}>
        <Dropdown.Toggle as="a" className="navbar-nav-link">
          <div className="admin-img">
            <div className="admin-avatar-placeholder">U</div>
          </div>
        </Dropdown.Toggle>
      </Dropdown>
    );
  }

  // Get user role label
  const getRoleLabel = (role) => {
    if (!role || typeof role !== "string") return "Người dùng";
    const roles = {
      admin: "Quản trị viên",
      superior_general: "Bề Trên Tổng",
      superior_provincial: "Bề Trên Tỉnh",
      superior_community: "Bề Trên Cộng Đoàn",
      secretary: "Thư ký",
      viewer: "Người xem",
    };
    return roles[role] || "Người dùng";
  };

  // Safe string getter
  const safeString = (value, defaultValue = "") => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return defaultValue;
  };

  const userName =
    safeString(user.full_name) || safeString(user.username) || "User";
  const userEmail = safeString(user.email);
  const userRole = safeString(user.role, "user");

  // Get initials for avatar placeholder
  const getInitials = () => {
    const parts = userName.split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return userName.substring(0, 2);
  };

  // Get avatar URL
  const getAvatar = () => {
    if (user.avatar && typeof user.avatar === "string") {
      return user.avatar;
    }
    return null;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <Dropdown show={isOpen} onToggle={handleToggle} ref={dropdownRef}>
      <Dropdown.Toggle as="a" className="navbar-nav-link">
        <div className="admin-title">
          <h4 className="item-title">{userName}</h4>
          <span>{getRoleLabel(userRole)}</span>
        </div>
        <div className="admin-img">
          {getAvatar() ? (
            <img src={getAvatar()} alt={userName} />
          ) : (
            <div className="admin-avatar-placeholder">
              {getInitials().toUpperCase()}
            </div>
          )}
        </div>
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <div className="item-header">
          <h6 className="item-title">{userName}</h6>
        </div>
        <div className="item-content">
          <ul className="settings-list">
            <li>
              <Link to="/profile" onClick={handleItemClick}>
                <i className="fas fa-user"></i>
                Thông tin cá nhân
              </Link>
            </li>
            <li>
              <Link to="/settings" onClick={handleItemClick}>
                <i className="fas fa-cog"></i>
                Cài đặt tài khoản
              </Link>
            </li>
            <li>
              <Link to="/profile#password" onClick={handleItemClick}>
                <i className="fas fa-key"></i>
                Đổi mật khẩu
              </Link>
            </li>
            <li>
              <Link to="/help" onClick={handleItemClick}>
                <i className="fas fa-question-circle"></i>
                Trợ giúp
              </Link>
            </li>
            <li>
              <a href="#" onClick={handleLogoutClick} className="text-danger">
                <i className="fas fa-sign-out-alt"></i>
                Đăng xuất
              </a>
            </li>
          </ul>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserMenu;
