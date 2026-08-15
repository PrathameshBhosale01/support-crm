import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketById, updateTicket } from "../api/tickets";

const statusOptions = ["Open", "In Progress", "Closed"];

const statusColors = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Closed: "bg-green-100 text-green-700",
};

const TicketDetail = () => {
  const { ticket_id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [statusSaving, setStatusSaving] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await getTicketById(ticket_id);
      setTicket(data);
      setNotFound(false);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        console.error(err);
        setError("Failed to load ticket.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticket_id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      setStatusSaving(true);
      await updateTicket(ticket_id, { status: newStatus });
      await fetchTicket();
    } catch (err) {
      console.error(err);
      setError("Failed to update status.");
    } finally {
      setStatusSaving(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!noteText.trim()) return;

    try {
      setNoteSaving(true);
      await updateTicket(ticket_id, { notes: noteText.trim() });
      setNoteText("");
      await fetchTicket();
    } catch (err) {
      console.error(err);
      setError("Failed to add note.");
    } finally {
      setNoteSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading ticket...</p>;
  }

  if (notFound) {
    return (
      <div className="p-6">
        <p className="text-gray-600 mb-2">Ticket not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to tickets
        </Link>
      </div>
    );
  }

  if (error && !ticket) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to tickets
      </Link>

      <div className="flex items-center justify-between mt-2 mb-4">
        <h1 className="text-2xl font-semibold">{ticket.ticket_id}</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[ticket.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {ticket.status}
        </span>
      </div>

      <div className="border rounded-lg p-4 mb-6 space-y-2">
        <p><span className="font-medium">Customer:</span> {ticket.customer_name}</p>
        <p><span className="font-medium">Email:</span> {ticket.customer_email}</p>
        <p><span className="font-medium">Subject:</span> {ticket.subject}</p>
        <p><span className="font-medium">Description:</span> {ticket.description}</p>
        <p className="text-sm text-gray-500">
          Created: {new Date(ticket.created_at).toLocaleString()}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Update Status</label>
        <select
          value={ticket.status}
          onChange={handleStatusChange}
          disabled={statusSaving}
          className="border rounded-md px-3 py-2 text-sm"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">Notes</h2>

        {ticket.notes.length === 0 ? (
          <p className="text-gray-500 text-sm mb-4">No notes yet.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {ticket.notes.map((note, i) => (
              <li key={i} className="border rounded-md p-3 text-sm">
                <p>{note.note_text}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddNote} className="space-y-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Add a note..."
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={noteSaving || !noteText.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {noteSaving ? "Adding..." : "Add Note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;