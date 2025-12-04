// src/features/su-vu/components/MissionCard/MissionCard.jsx

import React from "react";
import { Card, Badge } from "react-bootstrap";
import { formatDate } from "@utils";
import "./MissionCard.css";

const getFieldLabel = (field) => {
  const fields = {
    education: "Giáo dục",
    pastoral: "Mục vụ",
    publishing: "Xuất bản",
    media: "Truyền thông",
    healthcare: "Y tế",
    social: "Xã hội",
  };
  return fields[field] || field;
};

const getFieldIcon = (field) => {
  const icons = {
    education: "fa-graduation-cap",
    pastoral: "fa-church",
    publishing: "fa-book",
    media: "fa-broadcast-tower",
    healthcare: "fa-heartbeat",
    social: "fa-hands-helping",
  };
  return icons[field] || "fa-briefcase";
};

const MissionCard = ({ mission, onView, onEdit, onDelete }) => {
  const isActive = !mission.end_date;

  return (
    <Card className="mission-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="mission-icon">
            <i className={`fas ${getFieldIcon(mission.field)}`}></i>
          </div>
          <Badge bg={isActive ? "success" : "secondary"}>
            {isActive ? "Đang làm" : "Đã kết thúc"}
          </Badge>
        </div>

        <Badge bg="info" className="mb-2">
          {getFieldLabel(mission.field)}
        </Badge>

        {mission.specific_role && (
          <h5 className="mission-position mb-2">{mission.specific_role}</h5>
        )}

        {mission.religious_name && (
          <p className="mission-organization mb-2">
            <i className="fas fa-user me-2"></i>
            {mission.religious_name}
          </p>
        )}

        <div className="mission-details">
          <div className="detail-item">
            <i className="fas fa-calendar text-primary me-2"></i>
            <span>
              {formatDate(mission.start_date)}
              {mission.end_date
                ? ` - ${formatDate(mission.end_date)}`
                : " - Hiện tại"}
            </span>
          </div>

          {mission.notes && (
            <div className="mission-description mt-2">
              <small className="text-muted">{mission.notes}</small>
            </div>
          )}
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-top">
        <div className="d-flex gap-2">
          {onView && (
            <button
              className="btn btn-sm btn-outline-primary flex-grow-1"
              onClick={() => onView(mission)}
            >
              <i className="fas fa-eye me-1"></i>
              Xem
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-success flex-grow-1"
            onClick={() => onEdit(mission)}
          >
            <i className="fas fa-edit me-1"></i>
            Sửa
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(mission)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default MissionCard;
