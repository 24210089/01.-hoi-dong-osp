// src/features/dashboard/components/QuickActions/QuickActions.jsx

import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./QuickActions.css";

const QuickActions = () => {
  const actions = [
    {
      label: "Thêm Nữ Tu",
      icon: "fas fa-user-plus",
      color: "primary",
      link: "/nu-tu/create",
    },
    {
      label: "Thêm Hành Trình",
      icon: "fas fa-route",
      color: "success",
      link: "/hanh-trinh/create",
    },
    {
      label: "Xem Báo Cáo",
      icon: "fas fa-chart-pie",
      color: "info",
      link: "/bao-cao",
    },
    {
      label: "Cài Đặt",
      icon: "fas fa-cog",
      color: "warning",
      link: "/settings",
    },
  ];

  return (
    <Card className="h-100">
      <Card.Header className="bg-white border-bottom">
        <h5 className="mb-0">
          <i className="fas fa-bolt me-2"></i>
          Thao tác nhanh
        </h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {actions.map((action, index) => (
            <Col xs={6} key={index}>
              <Link to={action.link} className="quick-action-card">
                <div className={`quick-action-icon bg-${action.color}`}>
                  <i className={action.icon}></i>
                </div>
                <span className="quick-action-label">{action.label}</span>
              </Link>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuickActions;
