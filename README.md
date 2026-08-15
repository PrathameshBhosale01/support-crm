# Support CRM

A full-stack customer support ticketing system — create tickets, search and filter the queue, view ticket details, update status, and log internal notes. Built for the Datastraw hiring assessment.

**Live app:** https://support-crm-kg1m.onrender.com

> First load may take 30-50 seconds if the app has been idle — it's on Render's free tier, which spins down after inactivity and wakes on the next request.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite), Tailwind CSS v4, React Router |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Atlas) via Mongoose |
| Deployment | Single Render Web Service — Express serves the built React app directly |

---

## Architecture

Frontend and backend are deployed as **one service**, not two. Express serves the built React app as static files and handles all `/api/*` routes itself — one public URL, no CORS configuration needed.

```text
support-crm/
├── server/                 # Express API
│   ├── config/db.js        # Mongoose connection
│   ├── models/              # Ticket, Note schemas
│   ├── controllers/         # Route handler logic
│   ├── routes/               # Route → controller wiring
│   ├── server.js             # App entry, static serving, SPA fallback
│   └── .env.example
│
└── client/                 # React app
    ├── src/
    │   ├── api/               # All backend calls, one function per endpoint
    │   ├── components/        # Shared UI (Navbar)
    │   ├── pages/              # TicketList, CreateTicket, TicketDetail
    │   └── App.jsx              # Routing
    └── .env.example
```

**Pattern:** Route → Controller → Model → MongoDB. Routes only map an HTTP verb + path to a controller function. Controllers hold all validation, error handling, and response logic. Models are the only layer that touches the database directly.

---

## Database Schema

Two collections, kept intentionally simple.

**Ticket**
```text
ticket_id       String, unique     e.g. "TKT-001", auto-generated
customer_name   String, required
customer_email  String, required
subject         String, required
description     String, required
status          String, enum: Open | In Progress | Closed (default: Open)
created_at      Date (auto)
updated_at      Date (auto)
```

**Note**
```text
ticket_id       String, indexed    links to Ticket.ticket_id
note_text       String, required
created_at      Date (auto)
```

Notes are a separate collection rather than embedded in the ticket document, since they're append-only and can grow unbounded over a ticket's lifetime.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tickets` | Create a ticket. Body: `{ customer_name, customer_email, subject, description }`. Returns `{ ticket_id, created_at }` |
| `GET` | `/api/tickets` | List tickets. Optional query params: `?status=Open\|In+Progress\|Closed`, `?search=<term>` (matches ticket ID, name, email, subject, or description) |
| `GET` | `/api/tickets/:ticket_id` | Full ticket detail including its notes, ordered oldest → newest. Returns `404` if not found |
| `PUT` | `/api/tickets/:ticket_id` | Update status and/or add a note. Body: `{ status?, notes? }` — both optional, at least one expected. Returns `{ success: true, updated_at }` |
| `GET` | `/api/health` | Health check, returns `{ message: "Support CRM API is running" }` |

All error responses follow `{ success: false, message: "..." }`. `400` = bad request, `404` = resource not found, `500` = server error.

---

## Running Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas cluster (or local MongoDB instance) with the connection string

### 1. Clone and install

```bash
git clone https://github.com/PrathameshBhosale01/support-crm.git
cd support-crm
```

### 2. Backend setup

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in your real values:

```text
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Start the backend:

```bash
npm run dev
```

Runs on `http://localhost:5000`.

### 3. Frontend setup

In a separate terminal:

```bash
cd client
npm install
```

Copy `.env.example` to `.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Runs on `http://localhost:5173`.

### 4. MongoDB Atlas network access

If using Atlas, make sure your current IP is allowed under **Network Access** in the Atlas dashboard, or the backend won't be able to connect.

---

## Deployment

Deployed as a single Render Web Service:

- **Build Command:** `npm install --prefix server && npm install --prefix client && npm run build --prefix client`
- **Start Command:** `node server/server.js`
- **Root Directory:** repository root (blank)
- **Environment Variables:**
  - `MONGODB_URI` — Atlas connection string
  - `VITE_API_URL` — `/api` (relative, since frontend and backend share one origin in production)
- **Health Check Path:** `/api/health`

Atlas Network Access must allow `0.0.0.0/0` for Render's servers to connect, since Render doesn't provide a fixed outbound IP on the free tier.

---

## Key Design Decisions

- **Single deployed service** instead of separate frontend/backend deployments — satisfies "one public URL," removes CORS entirely, and avoids a double cold-start on free hosting.
- **Notes are append-only** — matches the spec, and functions as an audit trail (who noted what, and when) rather than an editable document.
- **Frontend and backend validation both exist** — frontend for immediate UX feedback, backend as the actual integrity boundary, since the API can be hit directly regardless of the UI.
- **List endpoint returns only summary fields** via `.select()` — detail endpoint returns the full record. Standard REST practice, keeps list payloads lean.

---

## Known Limitations

- Search uses unescaped input in a MongoDB regex — fine at this scale, would need character escaping and a text index for production use with larger datasets.
- No authentication — out of scope per the assessment's own guidance for an MVP.
- No pagination on the ticket list — would be needed at real support-team volume.

---

## License

Built for the Datastraw Technologies hiring assessment.