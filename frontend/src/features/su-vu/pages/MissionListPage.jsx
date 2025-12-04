// src/features/su-vu/pages/MissionListPage.jsx (Updated)

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Nav, Tab } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { missionService } from "@services";
import { useTable, useDebounce } from "@hooks";
import MissionCard from "../components/MissionCard";
import MissionForm from "../components/MissionForm";
import MissionFilter from "../components/MissionFilter";
import SearchBox from "@components/common/SearchBox";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";

const MissionListPage = () => {
  const navigate = useNavigate();
  const { sisterId } = useParams();
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);

  const table = useTable({
    initialPageSize: 12,
  });

  const debouncedSearch = useDebounce(table.searchTerm, 500);

  useEffect(() => {
    fetchMissions();
  }, [table.currentPage, table.pageSize, debouncedSearch, table.filters]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const params = table.getTableParams();
      
      let response;
      if (sisterId) {
        // Fetch missions for specific sister
        response = await missionService.getBySister(sisterId, params);
      } else {
        response = await missionService.getList(params);
      }

      if (response.success) {
        const items = response.data?.items || response.data || [];
        setMissions(Array.isArray(items) ? items : []);
        table.setTotalItems(response.data?.total || items.length);
      }
    } catch (error) {
      console.error("Error fetching missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedMission(null);
    setShowForm(true);
  };

  const handleView = (mission) => {
    navigate(`/su-vu/${mission.id}`);
  };

  const handleEdit = (mission) => {
    setSelectedMission(mission);
    setShowForm(true);
  };

  const handleDelete = async (mission) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sứ vụ này?")) {
      try {
        const result = await missionService.delete(mission.id);
        if (result.success) {
          toast.success("Xóa sứ vụ thành công!");
          fetchMissions();
        } else {
          toast.error(result.error || "Không thể xóa sứ vụ");
        }
      } catch (error) {
        console.error("Error deleting mission:", error);
        toast.error("Đã xảy ra lỗi khi xóa sứ vụ");
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Add sisterId if provided via URL
      const payload = sisterId ? { ...values, sister_id: sisterId } : values;
      
      if (selectedMission) {
        const result = await missionService.update(selectedMission.id, payload);
        if (result.success) {
          toast.success("Cập nhật sứ vụ thành công!");
        } else {
          toast.error(result.error || "Không thể cập nhật sứ vụ");
          return;
        }
      } else {
        const result = await missionService.create(payload);
        if (result.success) {
          toast.success("Thêm sứ vụ mới thành công!");
        } else {
          toast.error(result.error || "Không thể thêm sứ vụ");
          return;
        }
      }
      setShowForm(false);
      fetchMissions();
    } catch (error) {
      console.error("Error saving mission:", error);
      toast.error("Đã xảy ra lỗi khi lưu sứ vụ");
    }
  };

  const activeMissions = missions.filter((m) => !m.end_date);
  const completedMissions = missions.filter((m) => m.end_date);

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

  return (
    <Container fluid className="py-4">
      <Breadcrumb title="Quản lý Sứ vụ" items={[{ label: "Quản lý Sứ vụ" }]} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="primary" onClick={handleAdd}>
          <i className="fas fa-plus me-2"></i>
          Thêm Sứ vụ
        </Button>
      </div>

      {/* Search & Filter */}
      <Row className="g-3 mb-4">
        <Col md={8}>
          <SearchBox
            value={table.searchTerm}
            onChange={table.handleSearch}
            placeholder="Tìm kiếm theo chức vụ, tổ chức, tên nữ tu..."
          />
        </Col>
        <Col md={4}>
          <MissionFilter
            filters={table.filters}
            onFilterChange={table.updateFilters}
            onClearFilters={table.clearFilters}
          />
        </Col>
      </Row>

      {missions.length > 0 ? (
        <Tab.Container defaultActiveKey="active">
          <Card>
            <Card.Header className="bg-white">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="active">
                    <i className="fas fa-play-circle me-2"></i>
                    Đang làm ({activeMissions.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="completed">
                    <i className="fas fa-check-circle me-2"></i>
                    Đã kết thúc ({completedMissions.length})
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="all">
                    <i className="fas fa-list me-2"></i>
                    Tất cả ({missions.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="active">
                  <Row className="g-4">
                    {activeMissions.map((mission) => (
                      <Col key={mission.id} xs={12} sm={6} lg={4}>
                        <MissionCard
                          mission={mission}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="completed">
                  <Row className="g-4">
                    {completedMissions.map((mission) => (
                      <Col key={mission.id} xs={12} sm={6} lg={4}>
                        <MissionCard
                          mission={mission}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey="all">
                  <Row className="g-4">
                    {missions.map((mission) => (
                      <Col key={mission.id} xs={12} sm={6} lg={4}>
                        <MissionCard
                          mission={mission}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      ) : (
        <Card>
          <Card.Body className="text-center py-5">
            <i
              className="fas fa-briefcase text-muted mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h5>Chưa có thông tin sứ vụ</h5>
            <p className="text-muted">
              Thêm sứ vụ đầu tiên để theo dõi công tác
            </p>
            <Button variant="primary" onClick={handleAdd}>
              <i className="fas fa-plus me-2"></i>
              Thêm Sứ vụ
            </Button>
          </Card.Body>
        </Card>
      )}

      <MissionForm
        show={showForm}
        onHide={() => setShowForm(false)}
        mission={selectedMission}
        onSubmit={handleSubmit}
        sisterId={sisterId}
      />
    </Container>
  );
};

export default MissionListPage;
