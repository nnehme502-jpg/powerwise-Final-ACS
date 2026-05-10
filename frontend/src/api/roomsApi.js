import api from "./axios";

export const getRooms = () => api.get("/rooms");
export const createRoom = (roomData) => api.post("/rooms", roomData);
