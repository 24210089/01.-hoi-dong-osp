// src/features/auth/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context";
import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      setError("");

      const result = await login(values);

      if (result.success) {
        navigate("/dashboard");
      } else {
        // Kiểm tra nếu là lỗi xác thực sai
        const errorMsg = result.error || "";
        if (errorMsg.toLowerCase().includes("invalid") || 
            errorMsg.toLowerCase().includes("credentials") ||
            errorMsg.toLowerCase().includes("incorrect") ||
            errorMsg.toLowerCase().includes("wrong")) {
          setError("Sai tên đăng nhập hoặc mật khẩu, vui lòng đăng nhập lại");
        } else {
          setError(errorMsg || "Sai tên đăng nhập hoặc mật khẩu, vui lòng đăng nhập lại");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      // Lấy message lỗi từ backend
      const errorMessage = err.response?.data?.message || err.message || "";
      
      // Kiểm tra nếu là lỗi xác thực sai
      if (errorMessage.toLowerCase().includes("invalid") || 
          errorMessage.toLowerCase().includes("credentials") ||
          errorMessage.toLowerCase().includes("incorrect") ||
          errorMessage.toLowerCase().includes("wrong") ||
          err.response?.status === 401) {
        setError("Sai tên đăng nhập hoặc mật khẩu, vui lòng đăng nhập lại");
      } else {
        setError(errorMessage || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        onClearError={() => setError("")}
      />
    </div>
  );
};

export default LoginPage;
