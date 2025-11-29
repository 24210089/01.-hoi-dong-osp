// features/settings/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Tabs,
  Tab,
  Alert,
} from "react-bootstrap";
import {
  FaCog,
  FaDatabase,
  FaBell,
  FaShieldAlt,
  FaPalette,
} from "react-icons/fa";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Hệ Thống Quản Lý Hội Dòng OSP",
    siteDescription: "Quản lý thông tin nữ tu và hoạt động của Hội Dòng",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    language: "vi",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    systemNotifications: true,
    birthdayReminder: true,
    anniversaryReminder: true,
    evaluationReminder: true,
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Call API to save settings
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Đã lưu cài đặt thành công!" });
    } catch (error) {
      setMessage({ type: "danger", text: "Lỗi khi lưu cài đặt!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="d-flex align-items-center gap-2">
            <FaCog /> Cài Đặt Hệ Thống
          </h2>
          <p className="text-muted">Quản lý cài đặt và cấu hình hệ thống</p>
        </Col>
      </Row>

      {message.text && (
        <Alert
          variant={message.type}
          dismissible
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            {/* General Settings */}
            <Tab
              eventKey="general"
              title={
                <span>
                  <FaCog className="me-2" />
                  Chung
                </span>
              }
            >
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tên hệ thống</Form.Label>
                      <Form.Control
                        type="text"
                        name="siteName"
                        value={generalSettings.siteName}
                        onChange={handleGeneralChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngôn ngữ</Form.Label>
                      <Form.Select
                        name="language"
                        value={generalSettings.language}
                        onChange={handleGeneralChange}
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Múi giờ</Form.Label>
                      <Form.Select
                        name="timezone"
                        value={generalSettings.timezone}
                        onChange={handleGeneralChange}
                      >
                        <option value="Asia/Ho_Chi_Minh">
                          Việt Nam (GMT+7)
                        </option>
                        <option value="America/New_York">
                          New York (GMT-5)
                        </option>
                        <option value="Europe/London">London (GMT+0)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Định dạng ngày</Form.Label>
                      <Form.Select
                        name="dateFormat"
                        value={generalSettings.dateFormat}
                        onChange={handleGeneralChange}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                  />
                </Form.Group>
              </Form>
            </Tab>

            {/* Notification Settings */}
            <Tab
              eventKey="notifications"
              title={
                <span>
                  <FaBell className="me-2" />
                  Thông Báo
                </span>
              }
            >
              <Form>
                <Form.Check
                  type="switch"
                  id="emailNotifications"
                  name="emailNotifications"
                  label="Gửi thông báo qua email"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="systemNotifications"
                  name="systemNotifications"
                  label="Hiển thị thông báo hệ thống"
                  checked={notificationSettings.systemNotifications}
                  onChange={handleNotificationChange}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="birthdayReminder"
                  name="birthdayReminder"
                  label="Nhắc nhở sinh nhật"
                  checked={notificationSettings.birthdayReminder}
                  onChange={handleNotificationChange}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="anniversaryReminder"
                  name="anniversaryReminder"
                  label="Nhắc nhở ngày khấn"
                  checked={notificationSettings.anniversaryReminder}
                  onChange={handleNotificationChange}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="evaluationReminder"
                  name="evaluationReminder"
                  label="Nhắc nhở đánh giá định kỳ"
                  checked={notificationSettings.evaluationReminder}
                  onChange={handleNotificationChange}
                  className="mb-3"
                />
              </Form>
            </Tab>

            {/* Security Settings */}
            <Tab
              eventKey="security"
              title={
                <span>
                  <FaShieldAlt className="me-2" />
                  Bảo Mật
                </span>
              }
            >
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Thời gian hết hạn phiên đăng nhập (phút)
                  </Form.Label>
                  <Form.Control type="number" defaultValue={60} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Độ dài mật khẩu tối thiểu</Form.Label>
                  <Form.Control type="number" defaultValue={8} />
                </Form.Group>
                <Form.Check
                  type="switch"
                  id="requireStrongPassword"
                  label="Yêu cầu mật khẩu mạnh"
                  defaultChecked
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="twoFactorAuth"
                  label="Bật xác thực hai yếu tố"
                  className="mb-3"
                />
              </Form>
            </Tab>

            {/* Backup Settings */}
            <Tab
              eventKey="backup"
              title={
                <span>
                  <FaDatabase className="me-2" />
                  Sao Lưu
                </span>
              }
            >
              <Card className="border mb-3">
                <Card.Body>
                  <h6>Sao lưu tự động</h6>
                  <Form>
                    <Form.Check
                      type="switch"
                      id="autoBackup"
                      label="Bật sao lưu tự động"
                      defaultChecked
                      className="mb-3"
                    />
                    <Form.Group className="mb-3">
                      <Form.Label>Lịch sao lưu</Form.Label>
                      <Form.Select defaultValue="daily">
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                      </Form.Select>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
              <div className="d-flex gap-2">
                <Button variant="primary">
                  <FaDatabase className="me-2" />
                  Sao lưu ngay
                </Button>
                <Button variant="outline-primary">Khôi phục dữ liệu</Button>
              </div>
            </Tab>
          </Tabs>

          <div className="d-flex justify-content-end mt-4 pt-3 border-top">
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu cài đặt"}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SettingsPage;
