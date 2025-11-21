const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment configuration
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// TODO: Wire up actual routes when ready
app.get("/", (req, res) => {
  res.json({ message: "HR Records Management API is running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
