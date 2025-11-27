// src/features/dashboard/components/RecentActivities/RecentActivities.jsx

import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";
import { formatRelativeTime } from "@utils";

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      type: "create",
      message: "Thêm mới nữ tu Maria Nguyễn Thị A",
      user: "Admin",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: "fas fa-user-plus",
      color: "success",
    },
    {
      id: 2,
      type: "update",
      message: "Cập nhật thông tin hành trình",
      user: "Bề trên Tổng",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: "fas fa-edit",
      color: "primary",
    },
    {
      id: 3,
      type: "delete",
      message: "Xóa bản ghi sức khỏe",
      user: "Admin",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: "fas fa-trash",
      color: "danger",
    },
  ];

  return (
    <Card className="h-100">
      <Card.Header className="bg-white border-bottom">
        <h5 className="mb-0">
          <i className="fas fa-history me-2"></i>
          Hoạt động gần đây
        </h5>
      </Card.Header>
      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {activities.map((activity) => (
            <ListGroup.Item key={activity.id} className="border-0">
              <div className="d-flex align-items-start">
                <div
                  className={`activity-icon bg-${activity.color} bg-opacity-10 text-${activity.color} me-3`}
                >
                  <i className={activity.icon}></i>
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1">{activity.message}</p>
                  <small className="text-muted">
                    {activity.user} • {formatRelativeTime(activity.timestamp)}
                  </small>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
      <Card.Footer className="bg-white border-top text-center">
        <a href="/activities" className="text-primary">
          Xem tất cả hoạt động
        </a>
      </Card.Footer>
    </Card>
  );
};

export default RecentActivities;
