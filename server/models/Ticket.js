const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        ticket_id: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        customer_name: {
            type: String,
            required: true,
            trim: true,
        },

        customer_email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Open", "In Progress", "Closed"],
            default: "Open",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;