// src/features/cong-doan/pages/CongDoanListPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { communityService } from "@services";
import { formatDate } from "@utils";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import SearchBox from "@components/common/SearchBox";
import Breadcrumb from "@components/common/Breadcrumb";
import Pagination from "@components/common/Pagination";

const CongDoanListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    variant: "success",
    title: "",
    message: "",
  });

  const showToast = (variant, title, message) => {
    setToast({ show: true, variant, title, message });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    fetchCommunities();
  }, [currentPage, statusFilter]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await communityService.getList(params);
      if (response) {
        // Handle response format: { data: [...], meta: {...} }
        if (Array.isArray(response.data)) {
          setCommunities(response.data);
          setTotalPages(response.meta?.totalPages || 1);
        } else if (Array.isArray(response)) {
          setCommunities(response);
          setTotalPages(1);
        } else {
          setCommunities(response.items || []);
          setTotalPages(response.total_pages || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCommunities();
  };

  const handleViewDetail = (id) => {
    navigate(`/cong-doan/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/cong-doan/${id}/edit`);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cộng đoàn "${name}"?`)) {
      try {
        await communityService.delete(id);
        showToast(
          "success",
          "Xóa thành công!",
          `Đã xóa cộng đoàn "${name}" khỏi hệ thống.`
        );
        // Fetch lại danh sách từ server sau khi xóa
        await fetchCommunities();
      } catch (error) {
        console.error("Error deleting community:", error);
        let errorMessage = "Không thể xóa cộng đoàn. Vui lòng thử lại.";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        showToast("danger", "Xóa thất bại!", errorMessage);
      }
    }
  };

  const handleAssign = (id) => {
    navigate(`/cong-doan/${id}/assign`);
  };

  const filteredCommunities = communities.filter(
    (community) =>
      community.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="py-4">
      {/* Toast Notification */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          show={toast.show}
          onClose={hideToast}
          delay={5000}
          autohide
          bg={toast.variant}
        >
          <Toast.Header closeButton>
            <i
              className={`me-2 ${
                toast.variant === "success"
                  ? "fas fa-check-circle text-success"
                  : "fas fa-exclamation-circle text-danger"
              }`}
            ></i>
            <strong className="me-auto">{toast.title}</strong>
          </Toast.Header>
          <Toast.Body
            className={toast.variant === "danger" ? "text-white" : ""}
          >
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Breadcrumb
        title="Quản lý Cộng Đoàn"
        items={[{ label: "Quản lý Cộng Đoàn" }]}
      />

      <div className="d-flex justify-content-end align-items-center mb-4">
        <Button variant="primary" onClick={() => navigate("/cong-doan/create")}>
          Thêm Cộng Đoàn
        </Button>
      </div>

      <Card>
        <Card.Header className="bg-white">
          <Row className="align-items-center">
            <Col md={6}>
              <SearchBox
                value={searchTerm}
                onChange={setSearchTerm}
                onSearch={handleSearch}
                placeholder="Tìm kiếm cộng đoàn..."
              />
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <LoadingSpinner size="large" />
            </div>
          ) : filteredCommunities.length > 0 ? (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã số</th>
                  <th>Tên cộng đoàn</th>
                  <th>Địa chỉ</th>
                  <th>Số thành viên</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommunities.map((community, index) => (
                  <tr key={community.id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{community.code}</td>
                    <td>
                      <span
                        className="text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleViewDetail(community.id)}
                      >
                        {community.name}
                      </span>
                    </td>
                    <td>{community.address || "-"}</td>
                    <td>{community.member_count || 0}</td>
                    <td>
                      <Badge
                        bg={
                          community.status === "active"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {community.status === "active"
                          ? "Đang hoạt động"
                          : "Không hoạt động"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="me-1"
                        onClick={() => handleViewDetail(community.id)}
                        title="Xem chi tiết"
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-1"
                        onClick={() => handleAssign(community.id)}
                        title="Phân công"
                      >
                        <i className="fas fa-user-plus"></i>
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEdit(community.id)}
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleDelete(community.id, community.name)
                        }
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">Không tìm thấy cộng đoàn nào</p>
              <Button
                variant="primary"
                onClick={() => navigate("/cong-doan/create")}
              >
                Thêm cộng đoàn đầu tiên
              </Button>
            </div>
          )}
        </Card.Body>

        {totalPages > 1 && (
          <Card.Footer className="bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Card.Footer>
        )}
      </Card>
    </Container>
  );
};

export default CongDoanListPage;
