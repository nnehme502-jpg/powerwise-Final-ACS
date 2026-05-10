const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const devicesController = require("../controllers/devices.controller");

router.get("/", authMiddleware, devicesController.getDevices);
router.post("/", authMiddleware, devicesController.createDevice);
router.put("/:id", authMiddleware, devicesController.updateDevice);
router.delete("/:id", authMiddleware, devicesController.deleteDevice);

module.exports = router;