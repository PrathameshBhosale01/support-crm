const express = require("express");

const {
  createTicket,
  getTickets,
  getTicketById,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:ticket_id", getTicketById);

module.exports = router;