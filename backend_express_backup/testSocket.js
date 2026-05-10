const { io } = require("socket.io-client");

console.log("Starting socket test...");

const socket = io("http://localhost:3001", {
  transports: ["polling", "websocket"],
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  socket.emit("join", 3);
  console.log("Join event sent for user 3");
});

socket.on("connect_error", (err) => {
  console.log("Connect error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

socket.on("energy:created", (data) => {
  console.log("Energy event:", data);
});

socket.on("alert:created", (data) => {
  console.log("Alert event:", data);
});

socket.on("dashboard:updated", (data) => {
  console.log("Dashboard updated:", data);
});