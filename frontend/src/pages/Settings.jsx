import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Settings() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <section className="page-header">
          <div>
            <h1>Settings</h1>
            <p>Update profile and application preferences.</p>
          </div>
        </section>

        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>Settings Page</h3>
              <p>This page will contain user and app settings.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}