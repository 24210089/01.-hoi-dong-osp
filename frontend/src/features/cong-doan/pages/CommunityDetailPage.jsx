// src/features/cong-doan/pages/CommunityDetailPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Tab,
  Nav,
  Table,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { communityService } from "@services";
import { formatDate } from "@utils";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import "./CommunityDetailPage.css";

const getRoleLabel = (role) => {
  const roles = {
    superior: "Bề trên",
    assistant: "Phó bề trên",
    treasurer: "Thủ quỹ",
    secretary: "Thư ký",
    member: "Thành viên",
  };
  return roles[role] || "Thành viên";
};

const InfoItem = ({ label, value }) => (
  <div className="info-item">
    <small className="text-muted d-block mb-1">{label}</small>
    <div className="fw-semibold">{value || "-"}</div>
  </div>
);

const CommunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchCommunityDetail();
    fetchMembers();
  }, [id]);

  const fetchCommunityDetail = async () => {
    try {
      setLoading(true);
      const response = await communityService.getDetail(id);
      if (response && response.community) {
        setCommunity(response.community);
        // Nếu API trả về members cùng lúc
        if (response.members) {
          setMembers(response.members);
        }
      }
    } catch (error) {
      console.error("Error fetching community detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await communityService.getMembers(id);
      if (response && response.members) {
        setMembers(response.members);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/cong-doan/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cộng đoàn này?")) {
      try {
        await communityService.delete(id);
        navigate("/cong-doan");
      } catch (error) {
        console.error("Error deleting community:", error);
      }
    }
  };

  const handleAssignMembers = () => {
    navigate(`/cong-doan/${id}/assign`);
  };

  const handleViewMember = (memberId) => {
    navigate(`/nu-tu/${memberId}`);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!community) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <h3>Không tìm thấy thông tin cộng đoàn</h3>
          <Button variant="primary" onClick={() => navigate("/cong-doan")}>
            Quay lại danh sách
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Breadcrumb
        items={[
          { label: "Trang chủ", link: "/dashboard" },
          { label: "Quản lý Cộng Đoàn", link: "/cong-doan" },
          { label: community.name },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Thông tin Cộng Đoàn</h2>
          <p className="text-muted mb-0">Chi tiết thông tin cộng đoàn</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="success" onClick={handleEdit}>
            <i className="fas fa-edit me-2"></i>Chỉnh sửa
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <i className="fas fa-trash me-2"></i>Xóa
          </Button>
          <Button variant="secondary" onClick={() => navigate("/cong-doan")}>
            <i className="fas fa-arrow-left me-2"></i>Quay lại
          </Button>
        </div>
      </div>

      <Row className="g-4">
        <Col lg={4}>
          <Card className="community-profile-card">
            <Card.Body className="text-center">
              <div className="community-icon-large mb-3">
                <span style={{ fontSize: "3rem" }}>🏠</span>
              </div>
              <h3 className="mb-2">{community.name}</h3>
              <p className="text-muted mb-3">{community.code}</p>
              <Badge
                bg={community.status === "active" ? "success" : "secondary"}
                className="mb-3"
              >
                {community.status === "active"
                  ? "Đang hoạt động"
                  : "Không hoạt động"}
              </Badge>

              <div className="quick-stats mt-3">
                <div className="d-flex justify-content-around">
                  <div>
                    <small className="text-muted">Thành viên</small>
                    <h4 className="mb-0">{members.length}</h4>
                  </div>
                  <div>
                    <small className="text-muted">Thành lập</small>
                    <div className="fw-semibold">
                      {formatDate(community.established_date)}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-100 mt-3"
                onClick={handleAssignMembers}
              >
                <i className="fas fa-user-plus me-2"></i>Phân công thành viên
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Tab.Container defaultActiveKey="info">
            <Card>
              <Card.Header className="bg-white">
                <Nav variant="tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="info">
                      <i className="fas fa-info-circle me-2"></i>Thông tin
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="members">
                      <i className="fas fa-users me-2"></i>Thành viên (
                      {members.length})
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="info">
                    <h5 className="mb-3">Thông tin cơ bản</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <InfoItem
                          label="Tên cộng đoàn"
                          value={community.name}
                        />
                      </Col>
                      <Col md={6}>
                        <InfoItem label="Mã số" value={community.code} />
                      </Col>
                      <Col md={6}>
                        <InfoItem
                          label="Ngày thành lập"
                          value={formatDate(community.established_date)}
                        />
                      </Col>
                      <Col md={6}>
                        <InfoItem
                          label="Trạng thái"
                          value={
                            community.status === "active"
                              ? "Đang hoạt động"
                              : "Không hoạt động"
                          }
                        />
                      </Col>
                      <Col md={12}>
                        <InfoItem label="Địa chỉ" value={community.address} />
                      </Col>
                      <Col md={6}>
                        <InfoItem label="Điện thoại" value={community.phone} />
                      </Col>
                      <Col md={6}>
                        <InfoItem label="Email" value={community.email} />
                      </Col>
                      <Col md={12}>
                        <InfoItem label="Mô tả" value={community.description} />
                      </Col>
                    </Row>
                  </Tab.Pane>

                  <Tab.Pane eventKey="members">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Danh sách thành viên</h5>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAssignMembers}
                      >
                        <i className="fas fa-plus me-2"></i>Thêm thành viên
                      </Button>
                    </div>

                    {members.length > 0 ? (
                      <Table hover responsive>
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Mã số</th>
                            <th>Họ tên</th>
                            <th>Tên thánh</th>
                            <th>Vai trò</th>
                            <th>Ngày tham gia</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.map((member, index) => (
                            <tr key={member.id}>
                              <td>{index + 1}</td>
                              <td>{member.sister_code}</td>
                              <td>{member.birth_name}</td>
                              <td>{member.saint_name || "-"}</td>
                              <td>
                                <Badge
                                  bg={
                                    member.role === "superior"
                                      ? "danger"
                                      : member.role === "assistant"
                                      ? "warning"
                                      : "secondary"
                                  }
                                >
                                  {getRoleLabel(member.role)}
                                </Badge>
                              </td>
                              <td>{formatDate(member.start_date)}</td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() =>
                                    handleViewMember(member.sister_id)
                                  }
                                >
                                  <i className="fas fa-eye"></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center py-5">
                        <p className="text-muted">Chưa có thành viên nào</p>
                        <Button variant="primary" onClick={handleAssignMembers}>
                          <i className="fas fa-user-plus me-2"></i>Thêm thành
                          viên đầu tiên
                        </Button>
                      </div>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default CommunityDetailPage;
