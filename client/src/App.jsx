import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicketList from "./pages/TicketList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicketList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;