import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketList from "./pages/TicketList";
import CreateTicket from "./pages/CreateTicket";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketList />} />
        <Route path="/tickets/new" element={<CreateTicket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;