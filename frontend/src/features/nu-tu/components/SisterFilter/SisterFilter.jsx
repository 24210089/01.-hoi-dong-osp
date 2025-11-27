// src/features/nu-tu/components/SisterFilter/SisterFilter.jsx

import React, { useState } from "react";
import { Button, Offcanvas, Form, Badge } from "react-bootstrap";
import Select from "@components/forms/Select";
import {
  JOURNEY_STAGES,
  JOURNEY_STAGE_LABELS,
  SISTER_STATUS,
  SISTER_STATUS_LABELS,
} from "@utils/constants";
import "./SisterFilter.css";

const SisterFilter = ({ filters, onFilterChange, onClearFilters }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const handleClear = () => {
    onClearFilters();
    handleClose();
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      {/* Filter Button */}
      <Button
        variant="outline-secondary"
        onClick={handleShow}
        className="w-100"
      >
        <i className="fas fa-filter me-2"></i>
        Bộ lọc
        {activeFilterCount > 0 && (
          <Badge bg="primary" className="ms-2">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {/* Filter Offcanvas */}
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className="fas fa-filter me-2"></i>
            Bộ lọc tìm kiếm
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form>
            {/* Journey Stage */}
            <Form.Group className="mb-3">
              <Form.Label>Giai đoạn hành trình</Form.Label>
              <Select
                value={filters.stage || ""}
                onChange={(e) => handleChange("stage", e.target.value)}
              >
                <option value="">Tất cả</option>
                {Object.entries(JOURNEY_STAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Form.Group>

            {/* Status */}
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Select
                value={filters.status || ""}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="">Tất cả</option>
                {Object.entries(SISTER_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Form.Group>

            {/* Community */}
            <Form.Group className="mb-3">
              <Form.Label>Cộng đoàn</Form.Label>
              <Select
                value={filters.community_id || ""}
                onChange={(e) => handleChange("community_id", e.target.value)}
              >
                <option value="">Tất cả</option>
                {/* TODO: Load communities from API */}
              </Select>
            </Form.Group>

            {/* Age Range */}
            <Form.Group className="mb-3">
              <Form.Label>Độ tuổi</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Từ"
                  value={filters.age_from || ""}
                  onChange={(e) => handleChange("age_from", e.target.value)}
                />
                <Form.Control
                  type="number"
                  placeholder="Đến"
                  value={filters.age_to || ""}
                  onChange={(e) => handleChange("age_to", e.target.value)}
                />
              </div>
            </Form.Group>

            {/* Buttons */}
            <div className="d-flex gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={handleClear}
                className="flex-grow-1"
              >
                <i className="fas fa-redo me-2"></i>
                Xóa bộ lọc
              </Button>
              <Button
                variant="primary"
                onClick={handleClose}
                className="flex-grow-1"
              >
                <i className="fas fa-check me-2"></i>
                Áp dụng
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SisterFilter;
