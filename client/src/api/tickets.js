import api from "./client";

export const getTickets = async (params = {}) => {
  const response = await api.get("/tickets", { params });
  return response.data;
};