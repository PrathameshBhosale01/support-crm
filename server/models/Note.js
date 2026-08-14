const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        ticket_id: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },

        note_text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: false,
        },
    }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;