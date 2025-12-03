// src/features/bao-cao/pages/ReportDashboardPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { reportService } from "@services";
import { StatCard, ChartCard, ReportFilter } from "../components";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import "./ReportDashboardPage.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ReportDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    quick_range: "this_year",
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await reportService.getStatistics(filters);
      if (response.success) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilter = () => {
    fetchStatistics();
  };

  const handleClearFilter = () => {
    setFilters({
      start_date: "",
      end_date: "",
      quick_range: "this_year",
    });
  };

  const handleExport = async (format) => {
    try {
      const response = await reportService.export(format, filters);
      if (response.success) {
        // Handle file download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `bao-cao-${Date.now()}.${format}`);
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

  // Chart Data
  const sistersGrowthData = {
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
        label: "Số lượng nữ tu",
        data: statistics?.sistersGrowth || [],
        borderColor: "rgb(102, 126, 234)",
        backgroundColor: "rgba(102, 126, 234, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const journeyStageData = {
    labels: ["Dự tu", "Tập sinh", "Khấn tạm", "Khấn trọn"],
    datasets: [
      {
        data: statistics?.journeyStages || [0, 0, 0, 0],
        backgroundColor: [
          "rgba(102, 126, 234, 0.8)",
          "rgba(86, 171, 47, 0.8)",
          "rgba(79, 172, 254, 0.8)",
          "rgba(240, 147, 251, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const healthStatusData = {
    labels: ["Tốt", "Khá", "Trung bình", "Yếu"],
    datasets: [
      {
        data: statistics?.healthStatus || [0, 0, 0, 0],
        backgroundColor: [
          "rgba(86, 171, 47, 0.8)",
          "rgba(79, 172, 254, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const evaluationTrendData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Điểm trung bình",
        data: statistics?.evaluationTrend || [0, 0, 0, 0],
        backgroundColor: "rgba(102, 126, 234, 0.8)",
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
        title="Báo cáo & Thống kê"
        items={[{ label: "Báo cáo & Thống kê" }]}
      />

      {/* Header */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <div className="d-flex gap-2">
          <ReportFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />
          <ButtonGroup>
            <Button variant="success" onClick={() => handleExport("excel")}>
              <i className="fas fa-file-excel me-2"></i>
              Excel
            </Button>
            <Button variant="danger" onClick={() => handleExport("pdf")}>
              <i className="fas fa-file-pdf me-2"></i>
              PDF
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Tổng số nữ tu"
            value={statistics?.totalSisters || 0}
            icon="fas fa-users"
            color="primary"
            trend="up"
            trendValue="+5%"
            onClick={() => navigate("/nu-tu")}
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Cộng đoàn"
            value={statistics?.totalCommunities || 0}
            icon="fas fa-home"
            color="success"
            onClick={() => navigate("/cong-doan")}
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Đánh giá tháng này"
            value={statistics?.evaluationsThisMonth || 0}
            icon="fas fa-clipboard-check"
            color="info"
            trend="up"
            trendValue="+12%"
            onClick={() => navigate("/danh-gia")}
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title="Điểm TB đánh giá"
            value={statistics?.averageEvaluation || 0}
            icon="fas fa-star"
            color="warning"
            trend="up"
            trendValue="+3%"
          />
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <ChartCard
            title="Xu hướng tăng trưởng"
            subtitle="Số lượng nữ tu theo tháng"
            actions={[
              {
                icon: "fas fa-download",
                label: "Tải xuống",
                onClick: () => {},
              },
              { icon: "fas fa-print", label: "In", onClick: () => {} },
            ]}
          >
            <div style={{ height: "350px" }}>
              <Line data={sistersGrowthData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
        <Col lg={4}>
          <ChartCard
            title="Giai đoạn hành trình"
            subtitle="Phân bố theo giai đoạn"
          >
            <div style={{ height: "350px" }}>
              <Doughnut data={journeyStageData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="g-4 mb-4">
        <Col lg={4}>
          <ChartCard title="Tình trạng sức khỏe" subtitle="Phân loại sức khỏe">
            <div style={{ height: "300px" }}>
              <Pie data={healthStatusData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
        <Col lg={8}>
          <ChartCard
            title="Xu hướng đánh giá"
            subtitle="Điểm trung bình theo quý"
          >
            <div style={{ height: "300px" }}>
              <Bar data={evaluationTrendData} options={chartOptions} />
            </div>
          </ChartCard>
        </Col>
      </Row>

      {/* Quick Reports */}
      <Row className="g-4">
        <Col xs={12}>
          <ChartCard title="Báo cáo nhanh" subtitle="Các báo cáo thường dùng">
            <Row className="g-3">
              <Col md={3}>
                <Button
                  variant="outline-primary"
                  className="w-100 quick-report-btn"
                  onClick={() => navigate("/bao-cao/nu-tu")}
                >
                  <i className="fas fa-users fa-2x mb-2"></i>
                  <div>Báo cáo Nữ Tu</div>
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-success"
                  className="w-100 quick-report-btn"
                  onClick={() => navigate("/bao-cao/hanh-trinh")}
                >
                  <i className="fas fa-route fa-2x mb-2"></i>
                  <div>Báo cáo Hành trình</div>
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-info"
                  className="w-100 quick-report-btn"
                  onClick={() => navigate("/bao-cao/suc-khoe")}
                >
                  <i className="fas fa-heartbeat fa-2x mb-2"></i>
                  <div>Báo cáo Sức khỏe</div>
                </Button>
              </Col>
              <Col md={3}>
                <Button
                  variant="outline-warning"
                  className="w-100 quick-report-btn"
                  onClick={() => navigate("/bao-cao/danh-gia")}
                >
                  <i className="fas fa-clipboard-check fa-2x mb-2"></i>
                  <div>Báo cáo Đánh giá</div>
                </Button>
              </Col>
            </Row>
          </ChartCard>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportDashboardPage;
