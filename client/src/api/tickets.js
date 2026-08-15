import api from "./client";

export const getTickets = async (params = {}) => {
  const response = await api.get("/tickets", { params });
  return response.data;
};

export const createTicket = async (payload) => {
  const response = await api.post("/tickets", payload);
  return response.data;
};

export const getTicketById = async (ticket_id) => {
  const response = await api.get(`/tickets/${ticket_id}`);
  return response.data;
};

export const updateTicket = async (ticket_id, payload) => {
  const response = await api.put(`/tickets/${ticket_id}`, payload);
  return response.data;
};