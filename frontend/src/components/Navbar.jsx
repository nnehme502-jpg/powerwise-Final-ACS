import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, UserCircle2, LogOut } from "lucide-react";
import { getUnreadCount } from "../api/alertsApi";
import socket from "../socket";

export default function Navbar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();

    const reload = () => loadUnreadCount();

    socket.on("alert:created", reload);
    socket.on("alert:read", reload);
    socket.on("alert:deleted", reload);

    return () => {
      socket.off("alert:created", reload);
      socket.off("alert:read", reload);
      socket.off("alert:deleted", reload);
    };
  }, []);

  const loadUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(Number(res.data.unread_count || 0));
    } catch (err) {
      console.error("Unread count error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/");
  };

  return (
    <header className="topbar topbar-simple">
      <div />

      <div className="topbar-right">
        <button
          className="icon-btn bell-btn"
          type="button"
          onClick={() => navigate("/alerts")}
          title="Alerts"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="notif-count">{unreadCount}</span>
          )}
        </button>

        <button className="icon-btn" type="button" title="Profile">
          <UserCircle2 size={22} />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="secondary-btn"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginLeft: "10px",
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}