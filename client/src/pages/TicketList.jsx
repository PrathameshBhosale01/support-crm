import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Inbox } from "lucide-react";
import { getTickets } from "../api/tickets";

const statusStyles = {
  Open: { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  "In Progress": { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  Closed: {
    dot: "bg-[var(--color-accent)]",
    text: "text-[var(--color-accent)]",
    bg: "bg-[var(--color-accent-soft)]",
  },
};

const statusOptions = ["All", "Open", "In Progress", "Closed"];

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

const SkeletonRow = () => (
  <tr className="border-t border-[var(--color-border)]">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div
          className="h-3.5 bg-gray-100 rounded animate-pulse"
          style={{ width: `${60 + (i % 3) * 20}px` }}
        />
      </td>
    ))}
  </tr>
);

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (status !== "All") params.status = status;
        const data = await getTickets(params);
        setTickets(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [search, status]);

  const isFiltering = search || status !== "All";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
          <p className="text-sm text-[var(--color-ink-soft)] mt-1">
            {loading
              ? "Loading..."
              : `${tickets.length} ${tickets.length === 1 ? "ticket" : "tickets"}`}
          </p>
        </div>
        <Link
          to="/tickets/new"
          className="inline-flex items-center gap-1.5 bg-[var(--color-accent)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          <Plus size={16} />
          New Ticket
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]"
          />
          <input
            type="text"
            placeholder="Search by name, ID, email, subject..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-lg pl-10 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-[var(--color-border)] rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-[var(--color-bg)] text-[var(--color-ink-soft)] text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-16">
                  <div className="flex flex-col items-center text-center">
                    <Inbox
                      size={28}
                      className="text-[var(--color-ink-soft)] mb-3"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm font-medium text-[var(--color-ink)]">
                      {isFiltering ? "No matching tickets" : "No tickets yet"}
                    </p>
                    <p className="text-sm text-[var(--color-ink-soft)] mt-1">
                      {isFiltering
                        ? "Try a different search term or filter."
                        : "Create your first ticket to get started."}
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              tickets.map((ticket, i) => (
                <tr
                  key={ticket.ticket_id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}
                >
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/tickets/${ticket.ticket_id}`}
                      className="text-[var(--color-accent)] font-medium hover:underline"
                    >
                      {ticket.ticket_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">{ticket.customer_name}</td>
                  <td className="px-4 py-3.5 text-[var(--color-ink-soft)]">{ticket.subject}</td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={ticket.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[var(--color-ink-soft)]">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;