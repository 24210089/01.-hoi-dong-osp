// src/features/bao-cao/pages/EvaluationReportPage.jsx

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { Line, Radar, Bar } from "react-chartjs-2";
import { reportService } from "@services";
import { ChartCard, ReportFilter } from "../components";
import { formatDate } from "@utils";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";

const EvaluationReportPage = () => {
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
      const response = await reportService.getEvaluationReport(filters);
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Error fetching evaluation report:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await reportService.exportEvaluationReport(
        format,
        filters
      );
      if (response.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `bao-cao-danh-gia-${Date.now()}.${format}`
        );
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

  // Evaluation Trend Chart
  const evaluationTrendData = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Điểm trung bình",
        data: reportData?.monthlyAverage || [],
        borderColor: "rgb(102, 126, 234)",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Category Average Chart
  const categoryAverageData = {
    labels: [
      "Đời sống thiêng liêng",
      "Đời sống cộng đoàn",
      "Công tác tông đồ",
      "Phát triển cá nhân",
    ],
    datasets: [
      {
        label: "Điểm trung bình",
        data: reportData?.categoryAverage || [0, 0, 0, 0],
        backgroundColor: "rgba(102, 126, 234, 0.2)",
        borderColor: "rgb(102, 126, 234)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(102, 126, 234)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(102, 126, 234)",
      },
    ],
  };

  // Rating Distribution Chart
  const ratingDistributionData = {
    labels: ["90-100", "75-89", "60-74", "0-59"],
    datasets: [
      {
        label: "Số lượng",
        data: reportData?.ratingDistribution || [0, 0, 0, 0],
        backgroundColor: [
          "rgba(86, 171, 47, 0.8)",
          "rgba(79, 172, 254, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
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

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Báo cáo Đánh giá"
        items={[
          { label: "Báo cáo", link: "/bao-cao" },
          { label: "Báo cáo Đánh giá" },
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
                <i className="fas fa-clipboard-check"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Tổng đánh giá</div>
                <div className="summary-value">
                  {reportData?.totalEvaluations || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-success">
                <i className="fas fa-star"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Điểm TB</div>
                <div className="summary-value">
                  {reportData?.averageRating || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-info">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Xuất sắc</div>
                <div className="summary-value">
                  {reportData?.excellentCount || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="summary-icon bg-warning">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="summary-info">
                <div className="summary-label">Tháng này</div>
                <div className="summary-value">
                  {reportData?.thisMonthCount || 0}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <ChartCard
            title="Xu hướng đánh giá"
            subtitle="Điểm trung bình theo tháng"
          >
            <div style={{ height: "350px" }}>
              <Line data={evaluationTrendData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
        <Col lg={4}>
          <ChartCard title="Phân bố điểm" subtitle="Theo khoảng điểm">
            <div style={{ height: "350px" }}>
              <Bar data={ratingDistributionData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="g-4 mb-4">
        <Col lg={6}>
          <ChartCard
            title="Điểm theo tiêu chí"
            subtitle="Điểm trung bình từng mảng"
          >
            <div style={{ height: "350px" }}>
              <Radar data={categoryAverageData} options={radarOptions} />
            </div>
          </ChartCard>
        </Col>
        <Col lg={6}>
          <Card className="report-table-card">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Chi tiết theo tiêu chí
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="category-details">
                <div className="category-item mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">Đời sống thiêng liêng</span>
                    <Badge bg="success">
                      {reportData?.categoryAverage?.[0] || 0}
                    </Badge>
                  </div>
                  <ProgressBar
                    now={reportData?.categoryAverage?.[0] || 0}
                    variant="success"
                    style={{ height: "8px" }}
                  />
                </div>

                <div className="category-item mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">Đời sống cộng đoàn</span>
                    <Badge bg="info">
                      {reportData?.categoryAverage?.[1] || 0}
                    </Badge>
                  </div>
                  <ProgressBar
                    now={reportData?.categoryAverage?.[1] || 0}
                    variant="info"
                    style={{ height: "8px" }}
                  />
                </div>

                <div className="category-item mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">Công tác tông đồ</span>
                    <Badge bg="primary">
                      {reportData?.categoryAverage?.[2] || 0}
                    </Badge>
                  </div>
                  <ProgressBar
                    now={reportData?.categoryAverage?.[2] || 0}
                    variant="primary"
                    style={{ height: "8px" }}
                  />
                </div>

                <div className="category-item">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">Phát triển cá nhân</span>
                    <Badge bg="warning">
                      {reportData?.categoryAverage?.[3] || 0}
                    </Badge>
                  </div>
                  <ProgressBar
                    now={reportData?.categoryAverage?.[3] || 0}
                    variant="warning"
                    style={{ height: "8px" }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Performers */}
      <Card className="report-table-card mb-4">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-medal me-2"></i>
            Đánh giá xuất sắc
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="report-table">
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Nữ tu</th>
                  <th>Kỳ đánh giá</th>
                  <th>Tổng điểm</th>
                  <th>Thiêng liêng</th>
                  <th>Cộng đoàn</th>
                  <th>Tông đồ</th>
                  <th>Cá nhân</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.topPerformers?.map((performer, index) => (
                  <tr key={performer.id}>
                    <td>
                      <Badge
                        bg={
                          index === 0
                            ? "warning"
                            : index === 1
                            ? "secondary"
                            : "info"
                        }
                      >
                        #{index + 1}
                      </Badge>
                    </td>
                    <td className="fw-semibold">{performer.sister_name}</td>
                    <td>{performer.period}</td>
                    <td>
                      <Badge bg="success" className="px-3">
                        {performer.overall_rating}
                      </Badge>
                    </td>
                    <td>{performer.spiritual_life}</td>
                    <td>{performer.community_life}</td>
                    <td>{performer.apostolic_work}</td>
                    <td>{performer.personal_development}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Evaluations */}
      <Card className="report-table-card">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="fas fa-clock me-2"></i>
            Đánh giá gần đây
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="report-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Nữ tu</th>
                  <th>Loại</th>
                  <th>Kỳ đánh giá</th>
                  <th>Ngày đánh giá</th>
                  <th>Người đánh giá</th>
                  <th>Điểm</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.recentEvaluations?.map((evaluation, index) => (
                  <tr key={evaluation.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{evaluation.sister_name}</td>
                    <td>
                      <Badge bg="primary">{evaluation.type_label}</Badge>
                    </td>
                    <td>{evaluation.period}</td>
                    <td>{formatDate(evaluation.evaluation_date)}</td>
                    <td>{evaluation.evaluator}</td>
                    <td>
                      <Badge
                        bg={
                          evaluation.overall_rating >= 90
                            ? "success"
                            : evaluation.overall_rating >= 75
                            ? "info"
                            : evaluation.overall_rating >= 60
                            ? "warning"
                            : "danger"
                        }
                      >
                        {evaluation.overall_rating}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EvaluationReportPage;
