import api from "./axios";

export const getDevices = () => api.get("/devices");
export const createDevice = (deviceData) => api.post("/devices", deviceData);
export const updateDevice = (id, deviceData) => api.put(`/devices/${id}`, deviceData);
export const deleteDevice = (id) => api.delete(`/devices/${id}`);