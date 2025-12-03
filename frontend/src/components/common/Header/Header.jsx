import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Context
import { useAuth } from "@context/AuthContext";

// Styles
import "./Header.css";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      title: "Thông báo mới",
      message: "Sr. Maria đã cập nhật hồ sơ",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Nhắc nhở",
      message: "Có 3 hồ sơ cần phê duyệt",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Thành công",
      message: "Báo cáo tháng 1 đã được tạo",
      time: "2 giờ trước",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  return (
    <header className="header-menu-one">
      {/* Nav Bar Header (Logo Area - Orange) */}
      <div className="nav-bar-header-one">
        <div className="header-logo">
          <Link to="/dashboard">
            <i className="fas fa-church logo-icon"></i>
            <span className="logo-text">Hội Dòng OSP</span>
          </Link>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="mobile-nav-bar d-lg-none">
        <button 
          className="navbar-toggler" 
          type="button"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {/* Header Main Menu */}
      <div className="header-main-menu d-none d-lg-flex">
        {/* Search Bar */}
        <div className="header-search-bar">
          <div className="stylish-input-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tìm kiếm..."
            />
            <span className="input-group-addon">
              <button type="button">
                <i className="fas fa-search"></i>
              </button>
            </span>
          </div>
        </div>

        {/* Right Nav Items */}
        <ul className="navbar-nav">
          {/* Messages - Hover dropdown */}
          <li className="navbar-item header-message">
            <a className="navbar-nav-link" href="#">
              <i className="far fa-envelope"></i>
              <span>0</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <div className="item-header">
                <h6 className="item-title">Tin nhắn</h6>
              </div>
              <div className="item-content">
                <p className="text-center text-muted py-3">Không có tin nhắn mới</p>
              </div>
            </div>
          </li>

          {/* Notifications - Hover dropdown */}
          <li className="navbar-item header-notification">
            <a className="navbar-nav-link" href="#">
              <i className="far fa-bell"></i>
              <span>{unreadCount}</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <div className="item-header">
                <h6 className="item-title">Thông báo {unreadCount > 0 && `(${unreadCount} mới)`}</h6>
              </div>
              <div className="item-content">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`media ${!notification.read ? "unread" : ""}`}
                      onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    >
                      <div className={`item-icon ${
                        notification.type === 'info' ? 'bg-skyblue' : 
                        notification.type === 'warning' ? 'bg-yellow' : 
                        notification.type === 'success' ? 'bg-skyblue' : 'bg-pink'
                      }`}>
                        <i className={`fas ${
                          notification.type === 'info' ? 'fa-info-circle' : 
                          notification.type === 'warning' ? 'fa-exclamation-triangle' : 
                          notification.type === 'success' ? 'fa-check-circle' : 'fa-times-circle'
                        }`}></i>
                      </div>
                      <div className="media-body space-sm">
                        <div className="post-title">{notification.title}</div>
                        <p>{notification.message}</p>
                        <span>{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted py-3">Không có thông báo</p>
                )}
              </div>
            </div>
          </li>

          {/* User Menu - Hover dropdown */}
          <li className="navbar-item header-admin">
            <a className="navbar-nav-link" href="#">
              <div className="admin-title">
                <h5 className="item-title">{user?.full_name || user?.username || 'User'}</h5>
                <span>{user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</span>
              </div>
              <div className="admin-img">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.full_name || 'User'} />
                ) : (
                  <div className="admin-avatar-placeholder">
                    {(user?.full_name || user?.username || 'U').substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <div className="item-header">
                <h6 className="item-title">{user?.full_name || user?.username || 'User'}</h6>
              </div>
              <div className="item-content">
                <ul className="settings-list">
                  <li><Link to="/profile"><i className="fas fa-user"></i>Thông tin cá nhân</Link></li>
                  <li><Link to="/settings"><i className="fas fa-cog"></i>Cài đặt tài khoản</Link></li>
                  <li><Link to="/profile#password"><i className="fas fa-key"></i>Đổi mật khẩu</Link></li>
                  <li><Link to="/help"><i className="fas fa-question-circle"></i>Trợ giúp</Link></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="text-danger"><i className="fas fa-sign-out-alt"></i>Đăng xuất</a></li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
