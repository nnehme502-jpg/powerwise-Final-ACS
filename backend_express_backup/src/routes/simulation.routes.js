const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const simulationController = require("../controllers/simulation.controller");

router.post("/", authMiddleware, simulationController.runSimulation);

module.exports = router;