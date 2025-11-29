// src/App.jsx

import React from "react";
import { BrowserRouter } from "react-router-dom";

// Contexts
import { AuthProvider, NotificationProvider, SidebarProvider } from "@context";

// Routes
import AppRoutes from "./routes";

// Styles
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <SidebarProvider>
            <AppRoutes />
          </SidebarProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
