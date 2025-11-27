// src/features/dashboard/components/StatsOverview/StatsOverview.jsx

import React from "react";
import { Row, Col } from "react-bootstrap";
import StatCard from "@components/cards/StatCard";
import { formatNumber } from "@utils";
import "./StatsOverview.css";

const StatsOverview = ({ stats }) => {
  if (!stats) return null;

  return (
    <Row className="g-4">
      <Col xs={12} sm={6} lg={3}>
        <StatCard
          title="Tổng số Nữ Tu"
          value={formatNumber(stats.totalSisters)}
          icon="fas fa-users"
          color="primary"
          trend="up"
          trendValue="+5"
          trendLabel="so với tháng trước"
        />
      </Col>

      <Col xs={12} sm={6} lg={3}>
        <StatCard
          title="Đang hoạt động"
          value={formatNumber(stats.activeSisters)}
          icon="fas fa-user-check"
          color="success"
          subtitle={`${(
            (stats.activeSisters / stats.totalSisters) *
            100
          ).toFixed(1)}% tổng số`}
        />
      </Col>

      <Col xs={12} sm={6} lg={3}>
        <StatCard
          title="Cộng đoàn"
          value={formatNumber(stats.totalCommunities)}
          icon="fas fa-home"
          color="info"
        />
      </Col>

      <Col xs={12} sm={6} lg={3}>
        <StatCard
          title="Tuổi trung bình"
          value={`${stats.averageAge} tuổi`}
          icon="fas fa-birthday-cake"
          color="warning"
        />
      </Col>
    </Row>
  );
};

export default StatsOverview;
