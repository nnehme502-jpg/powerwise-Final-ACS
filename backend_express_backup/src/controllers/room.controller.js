const db = require("../db");

// GET all rooms for logged-in user
exports.getRooms = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM rooms WHERE user_id = $1 ORDER BY id ASC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET ROOMS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE room
exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Room name is required" });
    }

    const result = await db.query(
      "INSERT INTO rooms (user_id, name) VALUES ($1, $2) RETURNING *",
      [req.user.id, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("CREATE ROOM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Room name is required" });
    }

    const result = await db.query(
      "UPDATE rooms SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [name, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE ROOM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM rooms WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("DELETE ROOM ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};