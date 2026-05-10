import api from "./axios";

export const getAlerts = () => api.get("/alerts");
export const getUnreadCount = () => api.get("/alerts/unread-count");
export const markAlertAsRead = (id) => api.patch(`/alerts/${id}/read`);
export const deleteAlert = (id) => api.delete(`/alerts/${id}`);