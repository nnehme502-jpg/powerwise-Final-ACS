import api from "../../api/axios";

export const loginRequest = async (formData) => {
  const response = await api.post("/auth/login", formData);
  return response.data;
};

export const registerRequest = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};