// src/pages/errors/ServerErrorPage.jsx

import React, { useState } from "react";
import { Container, Button, Collapse, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ErrorPages.css";

const ServerErrorPage = ({ error, resetError }) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    if (resetError) resetError();
    navigate("/dashboard");
  };

  const handleReportError = () => {
    alert("Báo cáo lỗi đã được gửi. Cảm ơn bạn!");
  };

  return (
    <div className="error-page">
      <Container>
        <div className="error-content">
          <div className="error-illustration">
            <div className="error-icon-wrapper server-error">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
          </div>

          <div className="error-details">
            <h1 className="error-code">500</h1>
            <h2 className="error-title">Lỗi máy chủ</h2>
            <p className="error-description">
              Xin lỗi, đã xảy ra lỗi không mong muốn trên máy chủ.
              <br />
              Chúng tôi đang làm việc để khắc phục sự cố này.
            </p>

            {error && (
              <div className="error-message-container">
                <Button
                  variant="link"
                  onClick={() => setShowDetails(!showDetails)}
                  className="error-toggle"
                >
                  {showDetails ? "Ẩn" : "Xem"} chi tiết lỗi
                  <i
                    className={`fas fa-chevron-${
                      showDetails ? "up" : "down"
                    } ms-2`}
                  ></i>
                </Button>
                <Collapse in={showDetails}>
                  <Alert variant="danger" className="error-message">
                    <h6>Chi tiết lỗi:</h6>
                    <pre className="mb-0">{error.toString()}</pre>
                    {error.stack && (
                      <>
                        <hr />
                        <small>
                          <strong>Stack trace:</strong>
                          <pre className="mb-0">{error.stack}</pre>
                        </small>
                      </>
                    )}
                  </Alert>
                </Collapse>
              </div>
            )}

            <div className="error-actions">
              <Button
                variant="outline-primary"
                size="lg"
                onClick={handleRefresh}
                className="me-3"
              >
                <i className="fas fa-sync-alt me-2"></i>
                Tải lại trang
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleGoHome}
                className="me-3"
              >
                <i className="fas fa-home me-2"></i>
                Về trang chủ
              </Button>
              <Button
                variant="outline-danger"
                size="lg"
                onClick={handleReportError}
              >
                <i className="fas fa-bug me-2"></i>
                Báo lỗi
              </Button>
            </div>
          </div>

          <div className="error-info">
            <div className="info-card">
              <i className="fas fa-server text-danger"></i>
              <div>
                <h6>Máy chủ</h6>
                <p>Có vấn đề xảy ra với máy chủ của chúng tôi</p>
              </div>
            </div>
            <div className="info-card">
              <i className="fas fa-tools text-warning"></i>
              <div>
                <h6>Đang khắc phục</h6>
                <p>Đội ngũ kỹ thuật đang xử lý vấn đề này</p>
              </div>
            </div>
            <div className="info-card">
              <i className="fas fa-clock text-info"></i>
              <div>
                <h6>Thử lại</h6>
                <p>Vui lòng thử lại sau vài phút</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ServerErrorPage;
