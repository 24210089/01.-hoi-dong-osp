// src/features/nu-tu/pages/SisterListPage.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { sisterService } from "@services";
import { useTable, useDebounce } from "@hooks";
import SisterTable from "../components/SisterTable";
import SisterCard from "../components/SisterCard";
import SisterFilter from "../components/SisterFilter";
import SearchBox from "@components/common/SearchBox";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";

const SisterListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sisters, setSisters] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  const table = useTable({
    initialPageSize: 10,
  });

  const debouncedSearch = useDebounce(table.searchTerm, 500);

  useEffect(() => {
    fetchSisters();
  }, [
    table.currentPage,
    table.pageSize,
    debouncedSearch,
    table.filters,
    table.sortBy,
    table.sortOrder,
  ]);

  const fetchSisters = async () => {
    try {
      setLoading(true);
      const params = table.getTableParams();
      const response = await sisterService.getList(params);

      if (response.success) {
        setSisters(response.data.items);
        table.setTotalItems(response.data.total);
      }
    } catch (error) {
      console.error("Error fetching sisters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate("/nu-tu/create");
  };

  const handleView = (sister) => {
    navigate(`/nu-tu/${sister.id}`);
  };

  const handleEdit = (sister) => {
    navigate(`/nu-tu/${sister.id}/edit`);
  };

  const handleDelete = async (sister) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${sister.full_name}?`)) {
      try {
        await sisterService.delete(sister.id);
        fetchSisters();
      } catch (error) {
        console.error("Error deleting sister:", error);
      }
    }
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Quản lý Nữ Tu</h2>
          <p className="text-muted mb-0">
            Danh sách tất cả nữ tu trong hệ thống
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <i className="fas fa-plus me-2"></i>
          Thêm Nữ Tu
        </Button>
      </div>

      {/* Search & Filter */}
      <Row className="g-3 mb-4">
        <Col md={6}>
          <SearchBox
            value={table.searchTerm}
            onChange={table.handleSearch}
            placeholder="Tìm kiếm theo tên, tên thánh, mã số..."
          />
        </Col>
        <Col md={4}>
          <SisterFilter
            filters={table.filters}
            onFilterChange={table.updateFilters}
            onClearFilters={table.clearFilters}
          />
        </Col>
        <Col md={2}>
          <ButtonGroup className="w-100">
            <Button
              variant={viewMode === "table" ? "primary" : "outline-secondary"}
              onClick={() => setViewMode("table")}
            >
              <i className="fas fa-table"></i>
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "outline-secondary"}
              onClick={() => setViewMode("grid")}
            >
              <i className="fas fa-th"></i>
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      {/* List */}
      {loading ? (
        <div className="text-center py-5">
          <LoadingSpinner size="large" />
        </div>
      ) : viewMode === "table" ? (
        <SisterTable
          sisters={sisters}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={{
            currentPage: table.currentPage,
            totalPages: table.totalPages,
            pageSize: table.pageSize,
            onPageChange: table.goToPage,
            onPageSizeChange: table.changePageSize,
          }}
          sorting={{
            sortBy: table.sortBy,
            sortOrder: table.sortOrder,
            onSort: table.handleSort,
          }}
        />
      ) : (
        <Row className="g-4">
          {sisters.map((sister) => (
            <Col key={sister.id} xs={12} sm={6} lg={4} xl={3}>
              <SisterCard
                sister={sister}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SisterListPage;
