const Ticket = require("../models/Ticket");
const Note = require("../models/Note");
const createTicket = async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            subject,
            description,
        } = req.body;

        // Check required fields
        if (
            !customer_name ||
            !customer_email ||
            !subject ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Generate ticket ID
        const lastTicket = await Ticket.findOne()
            .sort({ created_at: -1 })
            .select("ticket_id");

        let nextNumber = 1;

        if (lastTicket) {
            const lastNumber = parseInt(
                lastTicket.ticket_id.replace("TKT-", ""),
                10
            );

            nextNumber = lastNumber + 1;
        }

        const ticket_id = `TKT-${String(nextNumber).padStart(3, "0")}`;

        // Create ticket
        const ticket = await Ticket.create({
            ticket_id,
            customer_name,
            customer_email,
            subject,
            description,
        });

        return res.status(201).json({
            ticket_id: ticket.ticket_id,
            created_at: ticket.created_at,
        });
    } catch (error) {
        console.error("Create ticket error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create ticket",
        });
    }
};

const getTickets = async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {};

    // Validate status
    if (
      status &&
      !["Open", "In Progress", "Closed"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ticket status",
      });
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Search filter
    if (search && search.trim()) {
      const searchTerm = search.trim();

      filter.$or = [
        {
          subject: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          description: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    const tickets = await Ticket.find(filter);

    return res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Get tickets error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};
const getTicketById = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    const ticket = await Ticket.findOne({ ticket_id })
      .select(
        "ticket_id customer_name customer_email subject description status created_at updated_at"
      );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const notes = await Note.find({ ticket_id })
      .select("note_text created_at")
      .sort({ created_at: 1 });

    return res.status(200).json({
      ticket_id: ticket.ticket_id,
      customer_name: ticket.customer_name,
      customer_email: ticket.customer_email,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
      notes,
    });
  } catch (error) {
    console.error("Get ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch ticket",
    });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status, notes } = req.body;

    // Find the ticket
    const ticket = await Ticket.findOne({ ticket_id });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Update status if provided
    if (status !== undefined) {
      if (!["Open", "In Progress", "Closed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ticket status",
        });
      }

      ticket.status = status;
    }

    // Save ticket changes
    await ticket.save();

    // Add note if provided
    if (notes && notes.trim()) {
      await Note.create({
        ticket_id,
        note_text: notes.trim(),
      });
    }

    return res.status(200).json({
      success: true,
      updated_at: ticket.updated_at,
    });
  } catch (error) {
    console.error("Update ticket error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update ticket",
    });
  }
};

module.exports = {
    createTicket,  getTickets,getTicketById,updateTicket,
};