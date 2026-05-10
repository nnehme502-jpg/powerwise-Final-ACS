const simulationService = require("../services/simulation.service");
const { simulateDeviceUsage } = require("../services/simulation.service");

exports.runSimulation = async (req, res) => {
  try {
    const { device_id, hours_used } = req.body;

    if (!device_id || !hours_used) {
      return res.status(400).json({
        error: "device_id and hours_used are required",
      });
    }

    const result = await simulationService.simulateDeviceUsage(
      Number(device_id),
      Number(hours_used)
    );

    res.status(201).json(result);
  } catch (err) {
    console.error("SIMULATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

//connect to socket and emit
exports.runSimulation = async (req, res) => {
  try {
    const { device_id, hours_used } = req.body;
    const result = await simulateDeviceUsage(device_id, hours_used);
    const io = req.app.get("io");

    io.to(`user:${req.user.id}`).emit("energy:created", result);

    res.json(result);
  } catch (err) {
    console.error("SIMULATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};