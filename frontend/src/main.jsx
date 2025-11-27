import React from "react";
import ReactDOM from "react-dom/client";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";

// Feature styles
import "./features/nu-tu/styles/sister.css";

// App
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
