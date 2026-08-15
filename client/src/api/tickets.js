import api from "./client";

export const getTickets = async (params = {}) => {
  const response = await api.get("/tickets", { params });
  return response.data;
};

export const createTicket = async (payload) => {
  const response = await api.post("/tickets", payload);
  return response.data;
};