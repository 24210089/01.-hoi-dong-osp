import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { communityService, sisterService } from "@services";
import { formatDate } from "@utils";
import Breadcrumb from "@components/common/Breadcrumb";
import DataTable from "@components/tables/DataTable";
import DatePicker from "@components/forms/DatePicker";
import "./AssignmentPage.css";

// Role labels and styles
const roleConfig = {
  leader: { label: "Bề trên", icon: "fa-crown", className: "role-leader" },
  vice_leader: {
    label: "Phó bề trên",
    icon: "fa-user-tie",
    className: "role-vice-leader",
  },
  superior: { label: "Bề trên", icon: "fa-crown", className: "role-leader" },
  assistant: {
    label: "Phó bề trên",
    icon: "fa-user-tie",
    className: "role-vice-leader",
  },
  secretary: {
    label: "Thư ký",
    icon: "fa-file-alt",
    className: "role-secretary",
  },
  treasurer: {
    label: "Thủ quỹ",
    icon: "fa-coins",
    className: "role-treasurer",
  },
  member: { label: "Thành viên", icon: "fa-user", className: "role-member" },
};

// Status labels and styles
const statusConfig = {
  active: {
    label: "Đang hoạt động",
    icon: "fa-check-circle",
    className: "status-active",
  },
  pending: {
    label: "Chờ xử lý",
    icon: "fa-clock",
    className: "status-pending",
  },
  completed: {
    label: "Đã hoàn thành",
    icon: "fa-check-double",
    className: "status-completed",
  },
  cancelled: {
    label: "Đã hủy",
    icon: "fa-times-circle",
    className: "status-cancelled",
  },
};

// Stage labels
const stageLabels = {
  inquiry: "Tìm hiểu",
  postulant: "Thỉnh sinh",
  aspirant: "Tiền tập",
  novice: "Tập viện",
  temporary_vows: "Khấn tạm",
  perpetual_vows: "Khấn trọn",
};

const AssignmentPage = () => {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [sisters, setSisters] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    community_id: "",
    role: "",
    status: "",
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    sister_id: "",
    community_id: "",
    role: "member",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    decision_number: "",
    notes: "",
    is_primary: true,
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
  });

  // Fetch data
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (communities.length > 0) {
      fetchAssignments();
    }
  }, [filters, communities]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [communitiesRes, sistersRes] = await Promise.all([
        communityService.getList({ limit: 100 }),
        sisterService.getList({ limit: 1000 }),
      ]);

      if (communitiesRes?.data) {
        // Remove duplicates by id
        const uniqueCommunities = communitiesRes.data.filter(
          (c, index, self) => index === self.findIndex((t) => t.id === c.id)
        );
        setCommunities(uniqueCommunities);
      }
      if (sistersRes?.data) {
        // Remove duplicates by id
        const uniqueSisters = sistersRes.data.filter(
          (s, index, self) => index === self.findIndex((t) => t.id === s.id)
        );
        setSisters(uniqueSisters);
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      // Get assignments from all communities
      const allAssignments = [];
      for (const community of communities) {
        try {
          const response = await communityService.getMembers(community.id);
          // API returns { members: [...] } or could be array directly
          const members = response?.members || response?.data?.members || (Array.isArray(response) ? response : []);
          if (members && Array.isArray(members)) {
            members.forEach((m) => {
              allAssignments.push({
                ...m,
                community_id: community.id,
                community_name: community.name,
              });
            });
          }
        } catch (err) {
          console.error(
            `Error fetching members for community ${community.id}:`,
            err
          );
        }
      }

      // Apply filters
      let filteredAssignments = allAssignments;

      if (filters.community_id) {
        filteredAssignments = filteredAssignments.filter(
          (a) => a.community_id === parseInt(filters.community_id)
        );
      }

      if (filters.role) {
        filteredAssignments = filteredAssignments.filter(
          (a) => a.role === filters.role
        );
      }

      if (filters.status) {
        const today = new Date();
        if (filters.status === "active") {
          filteredAssignments = filteredAssignments.filter(
            (a) => !a.end_date || new Date(a.end_date) > today
          );
        } else if (filters.status === "completed") {
          filteredAssignments = filteredAssignments.filter(
            (a) => a.end_date && new Date(a.end_date) <= today
          );
        }
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredAssignments = filteredAssignments.filter((a) => {
          const sister = sisters.find((s) => s.id === a.sister_id) || a;
          const name = sister.saint_name
            ? `${sister.saint_name} ${sister.birth_name}`
            : sister.birth_name || sister.full_name || "";
          return name.toLowerCase().includes(searchLower);
        });
      }

      setAssignments(filteredAssignments);

      // Calculate stats
      const today = new Date();
      const activeCount = allAssignments.filter(
        (a) => !a.end_date || new Date(a.end_date) > today
      ).length;
      const completedCount = allAssignments.filter(
        (a) => a.end_date && new Date(a.end_date) <= today
      ).length;

      setStats({
        total: allAssignments.length,
        active: activeCount,
        completed: completedCount,
      });
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({ community_id: "", role: "", status: "" });
    setSearchTerm("");
  };

  const handleOpenAddModal = () => {
    setFormData({
      sister_id: "",
      community_id: "",
      role: "member",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      decision_number: "",
      notes: "",
      is_primary: true,
    });
    setIsEditing(false);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (assignment) => {
    console.log("Opening edit modal for assignment:", assignment);
    setFormData({
      sister_id: assignment.sister_id || assignment.id,
      community_id: assignment.community_id,
      role: assignment.role || "member",
      start_date:
        assignment.start_date?.split("T")[0] ||
        assignment.joined_date?.split("T")[0] ||
        "",
      end_date: assignment.end_date?.split("T")[0] || "",
      decision_number: assignment.decision_number || "",
      notes: assignment.notes || "",
      is_primary: assignment.is_primary !== false,
    });
    setSelectedAssignment(assignment);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.sister_id || !formData.community_id) {
      toast.error("Vui lòng chọn nữ tu và cộng đoàn");
      return;
    }

    try {
      setSubmitting(true);

      if (isEditing && selectedAssignment) {
        console.log("Updating assignment:", {
          community_id: formData.community_id,
          assignment_id: selectedAssignment.id,
          data: {
            role: formData.role,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            decision_number: formData.decision_number || null,
            notes: formData.notes || null,
          }
        });
        
        const result = await communityService.updateMemberRole(
          formData.community_id,
          selectedAssignment.id,
          {
            role: formData.role,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            decision_number: formData.decision_number || null,
            notes: formData.notes || null,
          }
        );
        console.log("Update result:", result);
        toast.success("Đã cập nhật bổ nhiệm thành công");
      } else {
        await communityService.addMember(formData.community_id, {
          sister_id: parseInt(formData.sister_id),
          role: formData.role,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          decision_number: formData.decision_number || null,
          notes: formData.notes || null,
          is_primary: formData.is_primary,
        });
        toast.success("Đã thêm bổ nhiệm thành công");
      }

      setShowAddModal(false);
      fetchAssignments();
    } catch (err) {
      console.error("Error saving assignment:", err);
      toast.error("Có lỗi xảy ra khi lưu bổ nhiệm");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (assignment) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bổ nhiệm này?")) {
      return;
    }

    try {
      await communityService.removeMember(
        assignment.community_id,
        assignment.id
      );
      toast.success("Đã xóa bổ nhiệm thành công");
      fetchAssignments();
    } catch (err) {
      console.error("Error deleting assignment:", err);
      toast.error("Không thể xóa bổ nhiệm");
    }
  };

  const getRoleConfig = (role) => {
    return roleConfig[role] || roleConfig.member;
  };

  const getAssignmentStatus = (assignment) => {
    if (!assignment.end_date) return statusConfig.active;
    const endDate = new Date(assignment.end_date);
    const today = new Date();
    if (endDate > today) return statusConfig.active;
    return statusConfig.completed;
  };

  const getSisterById = (id) => {
    return sisters.find((s) => s.id === id);
  };

  const getCommunityById = (id) => {
    return communities.find((c) => c.id === id);
  };

  // Get filtered assignments based on search
  const getFilteredAssignments = () => {
    if (!searchTerm) return assignments;
    const searchLower = searchTerm.toLowerCase();
    return assignments.filter((a) => {
      const sister = sisters.find((s) => s.id === a.sister_id) || a;
      const name = sister.saint_name
        ? `${sister.saint_name} ${sister.birth_name}`
        : sister.birth_name || sister.full_name || "";
      const community = getCommunityById(a.community_id) || { name: a.community_name };
      return name.toLowerCase().includes(searchLower) || 
             (community?.name || "").toLowerCase().includes(searchLower);
    });
  };

  // Role badge color
  const getRoleBadgeColor = (role) => {
    const colors = {
      leader: "#d63031",
      superior: "#d63031",
      vice_leader: "#2d3436",
      assistant: "#2d3436",
      secretary: "#6c5ce7",
      treasurer: "#e84393",
      member: "#0984e3",
    };
    return colors[role] || "#6c757d";
  };

  // DataTable columns
  const columns = [
    {
      key: "sister_name",
      label: "Nữ Tu",
      sortable: true,
      render: (row) => {
        const sister = getSisterById(row.sister_id) || row;
        return (
          <div>
            {sister.saint_name && (
              <div className="text-primary fw-semibold" style={{ fontSize: "0.85rem" }}>
                {sister.saint_name}
              </div>
            )}
            <div style={{ fontSize: "0.85rem" }}>{sister.birth_name || row.birth_name}</div>
            <small className="text-muted">{stageLabels[sister.current_stage] || ""}</small>
          </div>
        );
      },
    },
    {
      key: "community_name",
      label: "Cộng Đoàn",
      sortable: true,
      render: (row) => {
        const community = getCommunityById(row.community_id) || { name: row.community_name };
        return community?.name || "N/A";
      },
    },
    {
      key: "role",
      label: "Chức Vụ",
      sortable: true,
      render: (row) => {
        const roleInfo = getRoleConfig(row.role);
        return (
          <Badge
            style={{
              backgroundColor: getRoleBadgeColor(row.role),
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            {roleInfo.label}
          </Badge>
        );
      },
    },
    {
      key: "start_date",
      label: "Ngày Bắt Đầu",
      sortable: true,
      render: (row) => formatDate(row.start_date || row.joined_date),
    },
    {
      key: "end_date",
      label: "Ngày Kết Thúc",
      sortable: true,
      render: (row) => (row.end_date ? formatDate(row.end_date) : "Hiện tại"),
    },
    {
      key: "status",
      label: "Trạng Thái",
      render: (row) => {
        const statusInfo = getAssignmentStatus(row);
        return (
          <Badge bg={statusInfo.className === "status-active" ? "success" : "secondary"}>
            {statusInfo.label}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Thao Tác",
      align: "center",
      className: "action-column",
      render: (row) => (
        <div className="d-flex justify-content-center">
          <Button
            variant="outline-info"
            size="sm"
            className="me-1"
            title="Xem chi tiết"
            onClick={(e) => {
              e.stopPropagation();
              handleViewAssignment(row);
            }}
          >
            <i className="fas fa-eye"></i>
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            className="me-1"
            title="Chỉnh sửa"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditModal(row);
            }}
          >
            <i className="fas fa-edit"></i>
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            title="Xóa"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <i className="fas fa-trash"></i>
          </Button>
        </div>
      ),
    },
  ];

  if (loading && assignments.length === 0 && communities.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const filteredAssignments = getFilteredAssignments();

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Quản Lý Bổ Nhiệm"
        items={[
          { label: "Quản lý Cộng Đoàn", link: "/cong-doan" },
          { label: "Quản lý Bổ Nhiệm" },
        ]}
      />

      {/* Statistics Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Tổng số</small>
                  <h4 className="mb-0">{stats.total}</h4>
                </div>
                <div className="stat-icon bg-primary">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Đang hoạt động</small>
                  <h4 className="mb-0">{stats.active}</h4>
                </div>
                <div className="stat-icon bg-success">
                  <i className="fas fa-check-circle"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Đã kết thúc</small>
                  <h4 className="mb-0">{stats.completed}</h4>
                </div>
                <div className="stat-icon bg-info">
                  <i className="fas fa-history"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Cộng đoàn</small>
                  <h4 className="mb-0">{communities.length}</h4>
                </div>
                <div className="stat-icon bg-warning">
                  <i className="fas fa-home"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search & Filter */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên nữ tu, cộng đoàn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Select
            value={filters.community_id}
            onChange={(e) => handleFilterChange("community_id", e.target.value)}
          >
            <option value="">Tất cả cộng đoàn</option>
            {communities.map((c) => (
              <option key={`filter-community-${c.id}`} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
          >
            <option value="">Tất cả chức vụ</option>
            <option value="superior">Bề trên</option>
            <option value="assistant">Phó bề trên</option>
            <option value="secretary">Thư ký</option>
            <option value="treasurer">Thủ quỹ</option>
            <option value="member">Thành viên</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="completed">Đã kết thúc</option>
          </Form.Select>
        </Col>
        <Col md={2} className="d-flex gap-2">
          <Button variant="outline-secondary" className="flex-grow-1" onClick={resetFilters}>
            <i className="fas fa-redo me-1"></i>
            Đặt lại
          </Button>
          <Button variant="primary" onClick={handleOpenAddModal}>
            <i className="fas fa-plus me-1"></i>
            Thêm
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <Card className="assignment-table">
        <Card.Body className="p-0">
          <DataTable
            columns={columns}
            data={filteredAssignments}
            loading={loading}
            emptyText="Không có dữ liệu bổ nhiệm"
            emptyIcon="fas fa-users-slash"
          />
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <i
              className={`fas ${isEditing ? "fa-edit" : "fa-user-plus"} me-2`}
            ></i>
            {isEditing ? "Chỉnh Sửa Bổ Nhiệm" : "Bổ Nhiệm Mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>
                  <i className="fas fa-user text-primary me-1"></i>
                  Nữ Tu <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.sister_id}
                  onChange={(e) =>
                    handleFormChange("sister_id", e.target.value)
                  }
                  disabled={isEditing}
                  required
                >
                  <option value="">-- Chọn nữ tu --</option>
                  {sisters.map((s) => (
                    <option key={`form-sister-${s.id}`} value={s.id}>
                      {s.saint_name
                        ? `${s.saint_name} ${s.birth_name}`
                        : s.birth_name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>
                  <i className="fas fa-home text-primary me-1"></i>
                  Cộng Đoàn <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.community_id}
                  onChange={(e) =>
                    handleFormChange("community_id", e.target.value)
                  }
                  disabled={isEditing}
                  required
                >
                  <option value="">-- Chọn cộng đoàn --</option>
                  {communities.map((c) => (
                    <option key={`form-community-${c.id}`} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>
                  <i className="fas fa-user-tag text-primary me-1"></i>
                  Chức Vụ <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.role}
                  onChange={(e) => handleFormChange("role", e.target.value)}
                  required
                >
                  <option value="member">Thành viên</option>
                  <option value="superior">Bề trên</option>
                  <option value="assistant">Phó bề trên</option>
                  <option value="secretary">Thư ký</option>
                  <option value="treasurer">Thủ quỹ</option>
                </Form.Select>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>
                  <i className="fas fa-toggle-on text-primary me-1"></i>
                  Chức Vụ Chính
                </Form.Label>
                <div className="mt-2">
                  <Form.Check
                    type="switch"
                    id="isPrimary"
                    label="Đây là chức vụ chính"
                    checked={formData.is_primary}
                    onChange={(e) =>
                      handleFormChange("is_primary", e.target.checked)
                    }
                  />
                </div>
              </Col>

              <Col md={6} className="mb-3">
                <DatePicker
                  label={
                    <>
                      <i className="fas fa-calendar-alt text-primary me-1"></i>
                      Ngày Bắt Đầu
                    </>
                  }
                  name="start_date"
                  value={formData.start_date}
                  onChange={(value) => handleFormChange("start_date", value)}
                  required
                />
              </Col>

              <Col md={6} className="mb-3">
                <DatePicker
                  label={
                    <>
                      <i className="fas fa-calendar-check text-primary me-1"></i>
                      Ngày Kết Thúc
                    </>
                  }
                  name="end_date"
                  value={formData.end_date}
                  onChange={(value) => handleFormChange("end_date", value)}
                  helpText="Để trống nếu không xác định"
                />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Label>
                  <i className="fas fa-file-alt text-primary me-1"></i>
                  Quyết Định Bổ Nhiệm
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Số quyết định..."
                  value={formData.decision_number}
                  onChange={(e) =>
                    handleFormChange("decision_number", e.target.value)
                  }
                />
              </Col>

              <Col md={12} className="mb-3">
                <Form.Label>
                  <i className="fas fa-comment-alt text-primary me-1"></i>
                  Ghi Chú
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập ghi chú..."
                  value={formData.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            <i className="fas fa-times me-1"></i>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="me-1" />
                Đang lưu...
              </>
            ) : (
              <>
                <i className="fas fa-save me-1"></i>
                Lưu Bổ Nhiệm
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <i className="fas fa-info-circle me-2"></i>
            Chi Tiết Bổ Nhiệm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAssignment && (() => {
            const sister = getSisterById(selectedAssignment.sister_id) || selectedAssignment;
            const community = getCommunityById(selectedAssignment.community_id) || { name: selectedAssignment.community_name };
            const roleInfo = getRoleConfig(selectedAssignment.role);
            const statusInfo = getAssignmentStatus(selectedAssignment);

            return (
              <Row>
                <Col md={6} className="mb-3">
                  <div className="info-card">
                    <h6><i className="fas fa-user me-2"></i>Thông Tin Nữ Tu</h6>
                    <div className="info-content">
                      <div className="info-item">
                        <span className="info-label">Tên thánh:</span>
                        <span className="info-value">{sister.saint_name || "—"}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Họ tên:</span>
                        <span className="info-value">{sister.birth_name || "—"}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Giai đoạn:</span>
                        <span className="info-value">{stageLabels[sister.current_stage] || "Chưa xác định"}</span>
                      </div>
                      {sister.phone && (
                        <div className="info-item">
                          <span className="info-label">Điện thoại:</span>
                          <span className="info-value">{sister.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="info-card">
                    <h6><i className="fas fa-briefcase me-2"></i>Thông Tin Bổ Nhiệm</h6>
                    <div className="info-content">
                      <div className="info-item">
                        <span className="info-label">Cộng đoàn:</span>
                        <span className="info-value">{community?.name || "—"}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Chức vụ:</span>
                        <span className="info-value">
                          <Badge style={{ backgroundColor: getRoleBadgeColor(selectedAssignment.role), color: "#fff" }}>
                            {roleInfo.label}
                          </Badge>
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Ngày bắt đầu:</span>
                        <span className="info-value">{formatDate(selectedAssignment.start_date || selectedAssignment.joined_date)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Ngày kết thúc:</span>
                        <span className="info-value">{selectedAssignment.end_date ? formatDate(selectedAssignment.end_date) : "Chưa xác định"}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Trạng thái:</span>
                        <span className="info-value">
                          <Badge bg={statusInfo.className === "status-active" ? "success" : "secondary"}>
                            {statusInfo.label}
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
                {selectedAssignment.notes && (
                  <Col md={12}>
                    <div className="info-card">
                      <h6><i className="fas fa-sticky-note me-2"></i>Ghi Chú</h6>
                      <div className="info-content">
                        <p className="mb-0">{selectedAssignment.notes}</p>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            );
          })()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Đóng
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              setShowViewModal(false);
              handleOpenEditModal(selectedAssignment);
            }}
          >
            <i className="fas fa-edit me-1"></i>
            Chỉnh Sửa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AssignmentPage;
