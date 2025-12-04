// src/features/nu-tu/components/SisterCard/SisterCard.jsx

import React from "react";
import { Card, Badge } from "react-bootstrap";
import { formatDate, calculateAge, resolveMediaUrl } from "@utils";
import { JOURNEY_STAGE_LABELS, JOURNEY_STAGE_COLORS } from "@utils/constants";
import "./SisterCard.css";

const SisterCard = ({ sister, onView, onEdit, onDelete }) => {
  const avatarUrl = resolveMediaUrl(sister.photo_url || sister.avatar_url);

  return (
    <Card className="sister-card h-100">
      <Card.Body>
        <div className="d-flex align-items-start mb-3">
          {/* Avatar */}
          <div className="sister-avatar me-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={sister.full_name} />
            ) : (
              <div className="avatar-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-grow-1">
            <h5 className="sister-name mb-1">
              {sister.religious_name && (
                <span className="text-primary me-2">
                  {sister.religious_name}
                </span>
              )}
              {sister.full_name}
            </h5>
            <p className="sister-code text-muted mb-2">
              <i className="fas fa-id-card me-1"></i>
              {sister.sister_code}
            </p>
            <Badge
              bg={JOURNEY_STAGE_COLORS[sister.current_stage]}
              className="sister-stage-badge"
            >
              {JOURNEY_STAGE_LABELS[sister.current_stage]}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="sister-details">
          <div className="detail-item">
            <i className="fas fa-birthday-cake text-muted me-2"></i>
            <span>
              {formatDate(sister.birth_date)} ({calculateAge(sister.birth_date)}{" "}
              tuổi)
            </span>
          </div>

          <div className="detail-item">
            <i className="fas fa-home text-muted me-2"></i>
            <span>{sister.community_name || "Chưa có cộng đoàn"}</span>
          </div>

          <div className="detail-item">
            <i className="fas fa-phone text-muted me-2"></i>
            <span>{sister.phone || "Chưa có SĐT"}</span>
          </div>

          <div className="detail-item">
            <i className="fas fa-envelope text-muted me-2"></i>
            <span>{sister.email || "Chưa có email"}</span>
          </div>
        </div>
      </Card.Body>

      {/* Actions */}
      <Card.Footer className="bg-white border-top">
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-primary flex-grow-1"
            onClick={() => onView(sister)}
          >
            <i className="fas fa-eye me-1"></i>
            Xem
          </button>
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => onEdit(sister)}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(sister)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default SisterCard;
