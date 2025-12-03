import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

const NotificationDropdown = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}) => {
  // Get icon and background based on notification type
  const getNotificationStyle = (type) => {
    const styles = {
      info: { icon: "fa-info-circle", bg: "bg-skyblue" },
      warning: { icon: "fa-exclamation-triangle", bg: "bg-yellow" },
      success: { icon: "fa-check-circle", bg: "bg-skyblue" },
      error: { icon: "fa-times-circle", bg: "bg-pink" },
    };
    return styles[type] || styles.info;
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="a" className="navbar-nav-link">
        <i className="far fa-bell"></i>
        <span>{unreadCount}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* Header */}
        <div className="item-header">
          <h6 className="item-title">
            Thông báo {unreadCount > 0 && `(${unreadCount} mới)`}
          </h6>
        </div>

        {/* Notification List */}
        <div className="item-content">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const styleData = getNotificationStyle(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`media ${!notification.read ? "unread" : ""}`}
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                >
                  <div className={`item-icon ${styleData.bg}`}>
                    <i className={`fas ${styleData.icon}`}></i>
                  </div>
                  <div className="media-body space-sm">
                    <div className="item-title">
                      <a href="#">
                        <span className="item-name">{notification.title}</span>
                        <span className="item-time">{notification.time}</span>
                      </a>
                    </div>
                    <p>{notification.message}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-bell-slash mb-2" style={{ fontSize: '2rem', color: '#ccc' }}></i>
              <p className="text-muted mb-0">Không có thông báo nào</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="text-center py-2" style={{ borderTop: '1px solid #f0f0f0' }}>
            <Link 
              to="/notifications" 
              style={{ color: '#ffa901', textDecoration: 'none', fontSize: '14px' }}
            >
              Xem tất cả thông báo
            </Link>
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationDropdown;
