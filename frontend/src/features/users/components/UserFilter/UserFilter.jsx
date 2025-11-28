// src/features/users/components/UserFilter/UserFilter.jsx

import React, { useState } from "react";
import { Button, Offcanvas, Form, Badge } from "react-bootstrap";
import Select from "@components/forms/Select";
import "./UserFilter.css";

const UserFilter = ({ filters, onFilterChange, onClearFilters }) => {
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
            Bộ lọc người dùng
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form>
            {/* Role Filter */}
            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Select
                value={filters.role || ""}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                <option value="">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="manager">Quản lý</option>
                <option value="staff">Nhân viên</option>
                <option value="viewer">Xem</option>
              </Select>
            </Form.Group>

            {/* Status Filter */}
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Select
                value={filters.status || ""}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </Select>
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

export default UserFilter;
