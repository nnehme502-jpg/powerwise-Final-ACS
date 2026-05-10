import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, Cpu, Bell } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo-block">
        <div className="logo-icon">⚡</div>
        <div>
          <h2>PowerWise</h2>
          <p>Smart Energy Home</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/analytics">
          <BarChart3 size={18} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/devices">
          <Cpu size={18} />
          <span>Devices</span>
        </NavLink>

        <NavLink to="/alerts">
          <Bell size={18} />
          <span>Alerts</span>
        </NavLink>
      </nav>
    </aside>
  );
}