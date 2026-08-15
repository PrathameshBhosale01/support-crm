const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/tickets", ticketRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Support CRM API is running" });
});

// Serve the built React frontend
app.use(express.static(path.join(__dirname, "../client/dist")));

// SPA fallback — any non-API route returns index.html so React Router can handle it.
// Express 5 requires a named wildcard; bare "*" throws at boot, not at request time.
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});