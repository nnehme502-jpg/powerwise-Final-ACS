const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const alertsController = require("../controllers/alerts.controller");

router.get("/", authMiddleware, alertsController.getAlerts);
router.get("/unread-count", authMiddleware, alertsController.getUnreadCount);
router.post("/", authMiddleware, alertsController.createAlert);
router.patch("/:id/read", authMiddleware, alertsController.markAsRead);
router.delete("/:id", authMiddleware, alertsController.deleteAlert);

module.exports = router;