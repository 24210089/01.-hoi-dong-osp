// src/pages/Dashboard.jsx

import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const Dashboard = () => {
  const stats = [
    { title: 'Tổng Nữ Tu', value: 150, icon: 'fas fa-users', color: 'primary' },
    { title: 'Cộng Đoàn', value: 12, icon: 'fas fa-church', color: 'success' },
    { title: 'Sứ Vụ', value: 25, icon: 'fas fa-hands-helping', color: 'info' },
    { title: 'Khóa Đào Tạo', value: 8, icon: 'fas fa-graduation-cap', color: 'warning' },
  ];

  return (
    <div className="dashboard">
      <h1 className="mb-4">Dashboard</h1>
      <p className="text-muted mb-4">Chào mừng bạn đến với Hệ Thống Quản Lý Hội Dòng</p>

      <Row className="g-4">
        {stats.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card className={`border-0 shadow-sm bg-${stat.color} bg-opacity-10`}>
              <Card.Body className="d-flex align-items-center">
                <div className={`icon-box bg-${stat.color} text-white rounded-circle p-3 me-3`}>
                  <i className={stat.icon}></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1">{stat.title}</h6>
                  <h3 className="mb-0">{stat.value}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
