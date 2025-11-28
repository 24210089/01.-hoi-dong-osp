// src/features/settings/pages/SettingsIndexPage.jsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaCog,
  FaServer,
  FaUserCog,
  FaDatabase,
  FaShieldAlt,
  FaBell,
} from "react-icons/fa";
import "./SettingsIndexPage.css";

const settingsItems = [
  {
    title: "Cài đặt chung",
    description: "Tên hệ thống, ngôn ngữ, múi giờ và định dạng ngày",
    icon: FaCog,
    path: "/settings/general",
    color: "primary",
  },
  {
    title: "Cài đặt hệ thống",
    description: "Email, bảo mật, cache và các cấu hình kỹ thuật",
    icon: FaServer,
    path: "/settings/system",
    color: "info",
  },
  {
    title: "Tùy chọn cá nhân",
    description: "Giao diện, thông báo và các tùy chọn người dùng",
    icon: FaUserCog,
    path: "/settings/preferences",
    color: "success",
  },
  {
    title: "Sao lưu & Khôi phục",
    description: "Quản lý sao lưu dữ liệu và khôi phục hệ thống",
    icon: FaDatabase,
    path: "/settings/backup",
    color: "warning",
  },
];

const SettingsIndexPage = () => {
  return (
    <Container fluid className="settings-index-page py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="page-title">
            <FaCog className="me-2" />
            Cài Đặt Hệ Thống
          </h2>
          <p className="text-muted">
            Quản lý cài đặt và cấu hình hệ thống
          </p>
        </Col>
      </Row>

      <Row>
        {settingsItems.map((item, index) => (
          <Col md={6} lg={3} key={index} className="mb-4">
            <Link to={item.path} className="text-decoration-none">
              <Card className={`settings-card h-100 border-${item.color}`}>
                <Card.Body className="text-center py-4">
                  <div className={`settings-icon bg-${item.color} mb-3`}>
                    <item.icon size={32} />
                  </div>
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text text-muted small">
                    {item.description}
                  </p>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <FaShieldAlt className="me-2" />
              Thông tin bảo mật
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <strong>Phiên đăng nhập:</strong> Hết hạn sau 60 phút
                </li>
                <li className="mb-2">
                  <strong>Xác thực 2 yếu tố:</strong> Chưa bật
                </li>
                <li>
                  <strong>Lần đổi mật khẩu cuối:</strong> 30 ngày trước
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <FaBell className="me-2" />
              Thông báo
            </Card.Header>
            <Card.Body>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <strong>Email thông báo:</strong> Đã bật
                </li>
                <li className="mb-2">
                  <strong>Nhắc nhở sinh nhật:</strong> Đã bật
                </li>
                <li>
                  <strong>Nhắc nhở đánh giá:</strong> Đã bật
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SettingsIndexPage;
