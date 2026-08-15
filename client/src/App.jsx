import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketList from "./pages/TicketList";
import CreateTicket from "./pages/CreateTicket";
import TicketDetail from "./pages/TicketDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketList />} />
        <Route path="/tickets/new" element={<CreateTicket />} />
        <Route path="/tickets/:ticket_id" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;