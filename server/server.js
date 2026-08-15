

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

const Ticket = require("./models/Ticket");
const Note = require("./models/Note");



// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());


app.use("/api/tickets", ticketRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Support CRM API is running",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log("Ticket model loaded:", !!Ticket);
console.log("Note model loaded:", !!Note);