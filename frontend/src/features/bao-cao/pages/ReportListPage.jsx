// src/features/bao-cao/pages/ReportListPage.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  Table,
  Button,
  Badge,
  Form,
  InputGroup,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import { reportService } from "@services";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import Pagination from "@components/common/Pagination";
import { formatDate } from "@utils";

const ReportListPage = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReports();
  }, [currentPage, filterType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockReports = [
        {
          id: 1,
          title: "Báo cáo tổng hợp nữ tu Q4/2024",
          type: "sister",
          type_label: "Nữ tu",
          created_at: "2024-12-01T10:00:00",
          created_by: "Admin",
          status: "completed",
        },
        {
          id: 2,
          title: "Báo cáo hành trình ơn gọi 2024",
          type: "journey",
          type_label: "Hành trình",
          created_at: "2024-11-28T14:30:00",
          created_by: "Admin",
          status: "completed",
        },
        {
          id: 3,
          title: "Báo cáo sức khỏe định kỳ",
          type: "health",
          type_label: "Sức khỏe",
          created_at: "2024-11-25T09:15:00",
          created_by: "Quản lý",
          status: "pending",
        },
        {
          id: 4,
          title: "Báo cáo đánh giá cuối năm",
          type: "evaluation",
          type_label: "Đánh giá",
          created_at: "2024-11-20T16:45:00",
          created_by: "Admin",
          status: "completed",
        },
      ];
      setReports(mockReports);
      setTotalPages(1);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (reportId, format) => {
    try {
      await reportService.export(format, { id: reportId });
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  const handleDelete = async (reportId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
      // Delete logic here
      setReports(reports.filter((r) => r.id !== reportId));
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchSearch = report.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType = !filterType || report.type === filterType;
    return matchSearch && matchType;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge bg="success">Hoàn thành</Badge>;
      case "pending":
        return <Badge bg="warning">Đang xử lý</Badge>;
      case "failed":
        return <Badge bg="danger">Lỗi</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      sister: "primary",
      journey: "info",
      health: "success",
      evaluation: "warning",
      community: "secondary",
    };
    return colors[type] || "secondary";
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

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Trang chủ", link: "/dashboard" },
          { label: "Báo cáo", link: "/bao-cao" },
          { label: "Danh sách báo cáo" },
        ]}
      />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Danh sách báo cáo</h2>
          <p className="text-muted mb-0">
            Quản lý và xem lại các báo cáo đã tạo
          </p>
        </div>
        <Link to="/bao-cao/generate" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Tạo báo cáo mới
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm báo cáo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tất cả loại</option>
                <option value="sister">Nữ tu</option>
                <option value="journey">Hành trình</option>
                <option value="health">Sức khỏe</option>
                <option value="evaluation">Đánh giá</option>
              </Form.Select>
            </Col>
            <Col md={5} className="text-end">
              <span className="text-muted">
                Tổng cộng: <strong>{filteredReports.length}</strong> báo cáo
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Report Table */}
      <Card>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Loại</th>
                  <th>Ngày tạo</th>
                  <th>Người tạo</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="text-muted">
                        <i className="fas fa-folder-open fa-3x mb-3 opacity-50"></i>
                        <p className="mb-0">Không có báo cáo nào</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report, index) => (
                    <tr key={report.id}>
                      <td>{index + 1}</td>
                      <td>
                        <Link
                          to={`/bao-cao/${report.id}`}
                          className="text-decoration-none fw-semibold"
                        >
                          {report.title}
                        </Link>
                      </td>
                      <td>
                        <Badge bg={getTypeBadge(report.type)}>
                          {report.type_label}
                        </Badge>
                      </td>
                      <td>{formatDate(report.created_at)}</td>
                      <td>{report.created_by}</td>
                      <td>{getStatusBadge(report.status)}</td>
                      <td className="text-center">
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="link"
                            className="text-muted p-0"
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <Dropdown.Item
                              as={Link}
                              to={`/bao-cao/${report.id}`}
                            >
                              <i className="fas fa-eye me-2"></i>
                              Xem chi tiết
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleExport(report.id, "excel")}
                            >
                              <i className="fas fa-file-excel me-2 text-success"></i>
                              Xuất Excel
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleExport(report.id, "pdf")}
                            >
                              <i className="fas fa-file-pdf me-2 text-danger"></i>
                              Xuất PDF
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              className="text-danger"
                              onClick={() => handleDelete(report.id)}
                            >
                              <i className="fas fa-trash me-2"></i>
                              Xóa
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>

        {/* Pagination */}
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

export default ReportListPage;
