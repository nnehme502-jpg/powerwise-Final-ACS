const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/summary", authMiddleware, dashboardController.getSummary);
router.get("/by-device", authMiddleware, dashboardController.getByDevice);
router.get("/by-room", authMiddleware, dashboardController.getByRoom);
router.get("/by-period", authMiddleware, dashboardController.getByPeriod);

module.exports = router;