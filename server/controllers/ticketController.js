const Ticket = require("../models/Ticket");

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

module.exports = {
    createTicket,
};