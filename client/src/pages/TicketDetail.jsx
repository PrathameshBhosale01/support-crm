import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageSquare, Inbox } from "lucide-react";
import { getTicketById, updateTicket } from "../api/tickets";

const statusOptions = ["Open", "In Progress", "Closed"];

const statusStyles = {
  Open: { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  "In Progress": { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  Closed: {
    dot: "bg-[var(--color-accent)]",
    text: "text-[var(--color-accent)]",
    bg: "bg-[var(--color-accent-soft)]",
  },
};

const StatusPill = ({ status }) => {
  const style =
    statusStyles[status] || { dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
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
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-8 w-40 bg-gray-100 rounded mb-6" />
        <div className="h-40 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <Inbox size={28} className="text-[var(--color-ink-soft)] mx-auto mb-3" strokeWidth={1.5} />
        <p className="font-medium mb-1">Ticket not found</p>
        <p className="text-sm text-[var(--color-ink-soft)] mb-4">
          "{ticket_id}" doesn't match any ticket in the system.
        </p>
        <Link to="/" className="text-sm text-[var(--color-accent)] font-medium hover:underline">
          Back to tickets
        </Link>
      </div>
    );
  }

  if (error && !ticket) {
    return <p className="max-w-2xl mx-auto px-6 py-10 text-red-600 text-sm">{error}</p>;
  }

  const inputClass =
    "w-full border border-[var(--color-border)] rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all";

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{ticket.ticket_id}</h1>
        <StatusPill status={ticket.status} />
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 mb-6">
        <dl className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
          <dt className="text-[var(--color-ink-soft)]">Customer</dt>
          <dd>{ticket.customer_name}</dd>
          <dt className="text-[var(--color-ink-soft)]">Email</dt>
          <dd>{ticket.customer_email}</dd>
          <dt className="text-[var(--color-ink-soft)]">Subject</dt>
          <dd>{ticket.subject}</dd>
          <dt className="text-[var(--color-ink-soft)]">Description</dt>
          <dd>{ticket.description}</dd>
          <dt className="text-[var(--color-ink-soft)]">Created</dt>
          <dd className="text-[var(--color-ink-soft)]">
            {new Date(ticket.created_at).toLocaleString()}
          </dd>
        </dl>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-xl p-6 mb-6">
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          value={ticket.status}
          onChange={handleStatusChange}
          disabled={statusSaving}
          className={inputClass + " max-w-xs"}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)] mb-3">
          <MessageSquare size={15} />
          Notes {ticket.notes.length > 0 && `(${ticket.notes.length})`}
        </h2>

        {ticket.notes.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-soft)] mb-4">No notes yet.</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {ticket.notes.map((note, i) => (
              <li
                key={i}
                className="bg-white border border-[var(--color-border)] rounded-lg p-3.5 text-sm"
              >
                <p>{note.note_text}</p>
                <p className="text-[var(--color-ink-soft)] text-xs mt-1.5">
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
            className={inputClass}
          />
          <button
            type="submit"
            disabled={noteSaving || !noteText.trim()}
            className="bg-[var(--color-accent)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
          >
            {noteSaving ? "Adding..." : "Add note"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;