const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roomController = require("../controllers/room.controller");

router.get("/", authMiddleware, roomController.getRooms);
router.post("/", authMiddleware, roomController.createRoom);
router.put("/:id", authMiddleware, roomController.updateRoom);
router.delete("/:id", authMiddleware, roomController.deleteRoom);

module.exports = router;