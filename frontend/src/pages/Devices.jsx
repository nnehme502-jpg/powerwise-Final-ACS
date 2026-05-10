import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  getDevices,
  createDevice,
  updateDevice,
  deleteDevice,
} from "../api/deviceApi";
import { getRooms, createRoom } from "../api/roomsApi";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    device_type: "",
    room_id: "",
    power_rating_watts: "",
    avg_daily_usage_hours: "",
    status: "inactive",
  });

  useEffect(() => {
    loadDevices();
    loadRooms();
  }, []);

  const loadDevices = async () => {
    try {
      const res = await getDevices();
      setDevices(res.data);
    } catch (err) {
      console.error("Devices load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.data);
    } catch (err) {
      console.error("Rooms load error:", err);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const res = await createRoom({ name: newRoomName.trim() });
      setRooms((prev) => [...prev, res.data]);
      setFormData((prev) => ({ ...prev, room_id: String(res.data.id) }));
      setNewRoomName("");
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || "Failed to create room");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDevice = async (e) => {
  e.preventDefault();

  try {
    await createDevice({
      name: formData.name,
      device_type: formData.device_type,
      room_id: parseInt(formData.room_id, 10),
      power_rating_watts: parseInt(formData.power_rating_watts, 10),
      avg_daily_usage_hours: parseFloat(formData.avg_daily_usage_hours),
      status: formData.status,
    });

    setShowForm(false);
    setFormData({
      name: "",
      device_type: "",
      room_id: "",
      power_rating_watts: "",
      avg_daily_usage_hours: "",
      status: "inactive",
    });

    loadDevices();
  } catch (err) {
    console.error("Create device error:", err);
    alert(err.response?.data?.error || "Failed to add device");
  }
};

  const handleToggleDevice = async (device) => {
    try {
      let nextStatus = "active";

      if (device.status === "active") nextStatus = "inactive";
      else if (device.status === "inactive") nextStatus = "active";
      else if (device.status === "maintenance") nextStatus = "active";

      await updateDevice(device.id, {
        status: nextStatus,
      });

      loadDevices();
    } catch (err) {
      console.error("Toggle device error:", err);
      alert(err.response?.data?.error || "Failed to update device");
    }
  };

  const handleDeleteDevice = async (id) => {
    try {
      await deleteDevice(id);
      loadDevices();
    } catch (err) {
      console.error("Delete device error:", err);
      alert(err.response?.data?.error || "Failed to delete device");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <section className="page-header devices-header">
          <div>
            <h1>Device &amp; Simulation Management</h1>
            <p>
              Monitor and manage your smart home appliances and their energy
              usage.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => setShowForm(!showForm)}
            type="button"
          >
            {showForm ? "Close Form" : "+ Add Device"}
          </button>
        </section>

        {showForm && (
          <form className="device-form" onSubmit={handleAddDevice}>
            <div className="form-group">
              <label className="form-label">Device Name</label>
              <input
                type="text"
                name="name"
                placeholder="Example: Kitchen Oven"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Device Type</label>
              <select
                name="device_type"
                value={formData.device_type}
                onChange={handleChange}
                required
              >
                <option value="">Select device type</option>
                <option value="heater">Heater</option>
                <option value="air_conditioner">Air Conditioner</option>
                <option value="washing_machine">Washing Machine</option>
                <option value="dryer">Dryer</option>
                <option value="refrigerator">Refrigerator</option>
                <option value="oven">Oven</option>
                <option value="dishwasher">Dishwasher</option>
                <option value="television">Television</option>
                <option value="computer">Computer</option>
                <option value="router">Router</option>
                <option value="lighting">Lighting</option>
                <option value="fan">Fan</option>
                <option value="water_heater">Water Heater</option>
                <option value="microwave">Microwave</option>
                <option value="vacuum">Vacuum</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Room</label>
              <select
                name="room_id"
                value={formData.room_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <div className="inline-room-form">
                <input
                  type="text"
                  placeholder="New room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                <button type="button" className="secondary-btn" onClick={handleCreateRoom}>
                  Add Room
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Power Rating (Watts)</label>
              <input
                type="number"
                name="power_rating_watts"
                placeholder="Example: 1200"
                value={formData.power_rating_watts}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Usage Hours / Day</label>
              <input
  type="number"
  step="0.1"
  min="0"
  name="avg_daily_usage_hours"
  placeholder="Example: 3"
  value={formData.avg_daily_usage_hours}
  onChange={handleChange}
  required
/>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="inactive">Inactive</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                Save Device
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="chart-card">
            <p>Loading devices...</p>
          </div>
        ) : devices.length === 0 ? (
          <div className="chart-card">
            <p>No devices found.</p>
          </div>
        ) : (
          <section className="devices-grid">
            {devices.map((device) => (
              <div className="device-card" key={device.id}>
                <div className="device-card-top">
                  <div>
                    <h3>{device.name}</h3>
                    <p>{device.device_type || "Device"}</p>
                  </div>

                  <button
                    type="button"
                    className={`device-status ${
                      device.status === "active" ? "active" : "inactive"
                    }`}
                    onClick={() => handleToggleDevice(device)}
                  >
                    {device.status ? device.status.toUpperCase() : "INACTIVE"}
                  </button>
                </div>

                <div className="device-power">
                  {device.power_rating_watts || 0}
                  <span> W</span>
                </div>

                <p className="device-meta">
                  Room: {device.room_name || device.room_id} | Hours/day:{" "}
                  {device.avg_daily_usage_hours || 0}
                </p>

                <div className="device-actions">
                  <button
                    type="button"
                    className="danger-btn"
                    onClick={() => handleDeleteDevice(device.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}