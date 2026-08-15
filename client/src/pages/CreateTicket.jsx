import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../api/tickets";

const fields = [
  { name: "customer_name", label: "Customer name", type: "text" },
  { name: "customer_email", label: "Customer email", type: "email" },
  { name: "subject", label: "Subject", type: "text" },
];

const CreateTicket = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.customer_name || !form.customer_email || !form.subject || !form.description) {
      setError("All fields are required.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await createTicket(form);
      navigate(`/tickets/${result.ticket_id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-[var(--color-border)] rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all";

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">New ticket</h1>
      <p className="text-sm text-[var(--color-ink-soft)] mb-8">
        Log a new customer issue for the support queue.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[var(--color-border)] rounded-xl p-6 space-y-5"
      >
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1.5">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[var(--color-accent)] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
        >
          {submitting ? "Creating..." : "Create ticket"}
        </button>
      </form>
    </div>
  );
};

export default CreateTicket;