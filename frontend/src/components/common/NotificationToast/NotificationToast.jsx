// src/components/common/NotificationToast/NotificationToast.jsx

import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import "./NotificationToast.css";

const NotificationToast = ({ notifications, onClose }) => {
  const getIcon = (type) => {
    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    };
    return icons[type] || icons.info;
  };

  const getVariant = (type) => {
    const variants = {
      success: "success",
      error: "danger",
      warning: "warning",
      info: "info",
    };
    return variants[type] || variants.info;
  };

  return (
    <ToastContainer position="top-end" className="notification-toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          show={notification.show}
          onClose={() => onClose(notification.id)}
          delay={notification.duration || 5000}
          autohide={notification.autohide !== false}
          className={`notification-toast notification-toast-${notification.type}`}
        >
          <Toast.Header closeButton={notification.closable !== false}>
            <i className={`fas ${getIcon(notification.type)} me-2`}></i>
            <strong className="me-auto">{notification.title}</strong>
            {notification.timeString && (
              <small className="text-muted">{notification.timeString}</small>
            )}
          </Toast.Header>
          {notification.message && (
            <Toast.Body>{notification.message}</Toast.Body>
          )}
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationToast;
