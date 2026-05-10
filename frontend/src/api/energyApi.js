import api from "./axios";

export const getDashboardSummary = () => api.get("/dashboard/summary");
export const getDashboardByDevice = () => api.get("/dashboard/by-device");
export const getDashboardByRoom = () => api.get("/dashboard/by-room");
export const getDashboardByPeriod = () => api.get("/dashboard/by-period");