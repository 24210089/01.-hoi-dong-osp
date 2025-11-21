const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables as early as possible
dotenv.config({ path: path.resolve(__dirname, ".env") });

const registerRoutes = require("./src/routes");
const { notFound, errorHandler } = require("./src/middlewares/errorHandler");
const db = require("./src/config/database");

const PORT = process.env.PORT || 3000;
const app = express();

// Core middlewares for security, parsing, and static assets
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// Attach all API routes
registerRoutes(app);

// Fallback handlers for unmatched routes and errors
app.use(notFound);
app.use(errorHandler);

// Verify DB connectivity before accepting requests
const startServer = async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log("Database connection verified successfully.");

    app.listen(PORT, () => {
      console.log(
        `HR Records Management API listening on port ${PORT} (env: ${process.env.NODE_ENV || "development"})`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
