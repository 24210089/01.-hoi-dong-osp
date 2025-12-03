// src/features/bao-cao/pages/SisterReportPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
} from "react-bootstrap";
import { Chart as ChartJS } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { reportService } from "@services";
import { ChartCard, ReportFilter } from "../components";
import { formatDate } from "@utils";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import "./SisterReportPage.css";

const SisterReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    quick_range: "this_year",
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await reportService.getSisterReport(filters);
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Error fetching sister report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await reportService.exportSisterReport(format, filters);
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `bao-cao-nu-tu-${Date.now()}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error("Error exporting report:", error);
    }
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

  // Age Distribution Chart
  const ageDistributionData = {
    labels: ["18-30", "31-40", "41-50", "51-60", "60+"],
    datasets: [
      {
        label: "Số lượng",
        data: reportData?.ageDistribution || [0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(102, 126, 234, 0.8)",
          "rgba(86, 171, 47, 0.8)",
          "rgba(79, 172, 254, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  // Status Distribution Chart
  const statusDistributionData = {
    labels: ["Đang hoạt động", "Đang nghỉ", "Đã nghỉ hưu"],
    datasets: [
      {
        data: reportData?.statusDistribution || [0, 0, 0],
        backgroundColor: [
          "rgba(86, 171, 47, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(156, 163, 175, 0.8)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Báo cáo Nữ Tu"
        items={[
          { label: "Báo cáo", link: "/bao-cao" },
          { label: "Báo cáo Nữ Tu" },
        ]}
      />

      {/* Header */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="d-flex gap-2">
          <ReportFilter
            filters={filters}
            onFilterChange={setFilters}
            onApply={fetchReportData}
            onClear={() => setFilters({ quick_range: "this_year" })}
          />
          <Button variant="success" onClick={() => handleExport("excel")}>
            <i className="fas fa-file-excel me-2"></i>
            Xuất Excel
          </Button>
          <Button variant="danger" onClick={() => handleExport("pdf")}>
            <i className="fas fa-file-pdf me-2"></i>
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-primary">
                <i className="fas fa-users"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Tổng số nữ tu</div>
                <div className="summary-value">
                  {reportData?.totalSisters || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-success">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Đang hoạt động</div>
                <div className="summary-value">
                  {reportData?.activeSisters || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-info">
                <i className="fas fa-birthday-cake"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Tuổi trung bình</div>
                <div className="summary-value">
                  {reportData?.averageAge || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-warning">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Mới tháng này</div>
                <div className="summary-value">
                  {reportData?.newThisMonth || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <ChartCard
            title="Phân bố theo độ tuổi"
            subtitle="Thống kê theo nhóm tuổi"
          >
            <div style={{ height: "350px" }}>
              <Bar data={ageDistributionData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
        <Col lg={4}>
          <ChartCard
            title="Phân bố theo trạng thái"
            subtitle="Tình trạng hoạt động"
          >
            <div style={{ height: "350px" }}>
              <Pie data={statusDistributionData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
      </Row>

      {/* Detailed Table */}
      <Card className="report-table-card">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-table me-2"></i>
            Chi tiết theo cộng đoàn
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="report-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Cộng đoàn</th>
                  <th>Tổng số</th>
                  <th>Dự tu</th>
                  <th>Tập sinh</th>
                  <th>Khấn tạm</th>
                  <th>Khấn trọn</th>
                  <th>Tuổi TB</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.communityBreakdown?.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{item.name}</td>
                    <td>
                      <Badge bg="primary">{item.total}</Badge>
                    </td>
                    <td>{item.aspirant}</td>
                    <td>{item.postulant}</td>
                    <td>{item.temporary}</td>
                    <td>{item.perpetual}</td>
                    <td>{item.averageAge}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-active fw-bold">
                  <td colSpan="2">Tổng cộng</td>
                  <td>
                    <Badge bg="primary">{reportData?.totalSisters || 0}</Badge>
                  </td>
                  <td>{reportData?.totalAspirant || 0}</td>
                  <td>{reportData?.totalPostulant || 0}</td>
                  <td>{reportData?.totalTemporary || 0}</td>
                  <td>{reportData?.totalPerpetual || 0}</td>
                  <td>{reportData?.averageAge || 0}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SisterReportPage;
