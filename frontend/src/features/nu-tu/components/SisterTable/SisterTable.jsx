// src/features/nu-tu/components/SisterTable/SisterTable.jsx

import React from "react";
import { Card } from "react-bootstrap";
import DataTable from "@components/tables/DataTable";
import { formatDate, calculateAge } from "@utils";
import { JOURNEY_STAGE_LABELS, SISTER_STATUS_LABELS } from "@utils/constants";
import "./SisterTable.css";

const SisterTable = ({
  sisters,
  onView,
  onEdit,
  onDelete,
  pagination,
  sorting,
}) => {
  const columns = [
    {
      key: "sister_code",
      label: "Mã số",
      sortable: true,
      width: "100px",
    },
    {
      key: "full_name",
      label: "Họ tên",
      sortable: true,
      render: (row) => (
        <div>
          {row.religious_name && (
            <div className="text-primary fw-semibold">{row.religious_name}</div>
          )}
          <div>{row.full_name}</div>
        </div>
      ),
    },
    {
      key: "birth_date",
      label: "Ngày sinh",
      sortable: true,
      render: (row) => (
        <div>
          <div>{formatDate(row.birth_date)}</div>
          <small className="text-muted">
            ({calculateAge(row.birth_date)} tuổi)
          </small>
        </div>
      ),
    },
    {
      key: "current_stage",
      label: "Giai đoạn",
      sortable: true,
      render: (row) => (
        <span className="badge bg-primary">
          {JOURNEY_STAGE_LABELS[row.current_stage]}
        </span>
      ),
    },
    {
      key: "community_name",
      label: "Cộng đoàn",
      sortable: true,
    },
    {
      key: "phone",
      label: "Điện thoại",
      render: (row) => row.phone || "-",
    },
    {
      key: "status",
      label: "Trạng thái",
      sortable: true,
      render: (row) => (
        <span className={`badge bg-${getStatusColor(row.status)}`}>
          {SISTER_STATUS_LABELS[row.status]}
        </span>
      ),
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      inactive: "warning",
      leave: "secondary",
      deceased: "dark",
    };
    return colors[status] || "secondary";
  };

  const actions = [
    {
      label: "Xem",
      icon: "fas fa-eye",
      variant: "primary",
      onClick: onView,
    },
    {
      label: "Sửa",
      icon: "fas fa-edit",
      variant: "success",
      onClick: onEdit,
    },
    {
      label: "Xóa",
      icon: "fas fa-trash",
      variant: "danger",
      onClick: onDelete,
    },
  ];

  return (
    <Card className="sister-table-card">
      <Card.Body className="p-0">
        <DataTable
          columns={columns}
          data={sisters}
          actions={actions}
          pagination={pagination}
          sorting={sorting}
          emptyMessage="Không có dữ liệu nữ tu"
        />
      </Card.Body>
    </Card>
  );
};

export default SisterTable;
