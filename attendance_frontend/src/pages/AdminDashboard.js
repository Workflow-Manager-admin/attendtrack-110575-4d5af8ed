import React, { useState } from "react";
import AttendanceReport from "../components/AttendanceReport";

/**
 * Mock admin data for users and attendance.
 */
const initialUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Employee",
    status: "Active",
    present: 21,
    absent: 1,
    late: 0,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "Employee",
    status: "Active",
    present: 19,
    absent: 2,
    late: 1,
  },
  {
    id: 3,
    name: "Maya Lee",
    email: "maya.lee@example.com",
    role: "Employee",
    status: "Inactive",
    present: 0,
    absent: 10,
    late: 0,
  },
  {
    id: 4,
    name: "Tariq Hassan",
    email: "tariq.hassan@example.com",
    role: "Employee",
    status: "Active",
    present: 22,
    absent: 0,
    late: 0,
  },
];

/**
 * Utility: returns random demo statistics for today.
 */
function getAttendanceSummary(users) {
  const total = users.length;
  const active = users.filter(u => u.status === "Active");
  const presentToday = Math.max(0, Math.floor((Math.random() * active.length)));
  return {
    total,
    active: active.length,
    presentToday,
    absentToday: active.length - presentToday,
  };
}

// PUBLIC_INTERFACE
function AdminDashboard() {
  /**
   * Admin Dashboard main entry: lists users, allows mocked add/remove, displays attendance summary/reporting.
   */
  // State for users
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ name: "", email: "", role: "Employee" });
  const [formError, setFormError] = useState("");
  const [view, setView] = useState("dashboard"); // "dashboard" | "report"

  // Attendance summary section (mocked for simplicity)
  const stats = getAttendanceSummary(users);

  // PUBLIC_INTERFACE
  const handleAddUser = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }
    // Check if email already exists
    if (users.some(u => u.email === form.email.trim())) {
      setFormError("Email must be unique.");
      return;
    }
    setUsers([
      ...users,
      {
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        status: "Active",
        present: 0,
        absent: 0,
        late: 0,
      },
    ]);
    setForm({ name: "", email: "", role: "Employee" });
    setFormError("");
  };

  // PUBLIC_INTERFACE
  const handleRemoveUser = id => {
    // Remove user (mock)
    setUsers(users.filter(u => u.id !== id));
  };

  // PUBLIC_INTERFACE
  const handleDeactivateUser = id => {
    setUsers(users.map(u =>
      u.id === id
        ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
        : u
    ));
  };

  // PUBLIC_INTERFACE
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Dashboard main content
  return (
    <div>
      {/* Title bar, quick navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <h1 style={{ fontSize: 28, marginBottom: 2, letterSpacing: 0.2 }}>
          Admin Dashboard
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setView("dashboard")}
            style={{
              background: view === "dashboard" ? "var(--button-bg)" : "var(--bg-secondary)",
              color: view === "dashboard" ? "var(--button-text)" : "var(--text-primary)",
              border: "none",
              borderRadius: 7,
              padding: "6px 14px",
              fontWeight: 600,
              cursor: "pointer",
              opacity: view === "dashboard" ? 1 : 0.7,
              marginRight: 4,
              transition: "all 0.15s",
            }}
          >User Management</button>
          <button
            onClick={() => setView("report")}
            style={{
              background: view === "report" ? "var(--button-bg)" : "var(--bg-secondary)",
              color: view === "report" ? "var(--button-text)" : "var(--text-primary)",
              border: "none",
              borderRadius: 7,
              padding: "6px 14px",
              fontWeight: 600,
              cursor: "pointer",
              opacity: view === "report" ? 1 : 0.7,
              transition: "all 0.15s",
            }}
          >Reports</button>
        </div>
      </div>
      <hr style={{ margin: "18px 0 24px 0", border: "0", borderTop: "1.5px solid var(--border-color)" }} />

      {/* Attendance summary quick stats */}
      {view === "dashboard" && (
        <>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 34,
            marginBottom: 26,
          }}>
            <SummaryCard label="Total Users" value={stats.total} color="#1976d2" />
            <SummaryCard label="Active Users" value={stats.active} color="#43a047" />
            <SummaryCard label="Present Today" value={stats.presentToday} color="#fbc02d" />
            <SummaryCard label="Absent Today" value={stats.absentToday} color="#b71c1c" />
          </div>

          <UserSection
            users={users}
            onRemove={handleRemoveUser}
            onDeactivate={handleDeactivateUser}
          />

          <div style={{
            background: "var(--bg-secondary)",
            borderRadius: 12,
            padding: "26px 28px 22px 28px",
            marginTop: "36px",
            boxShadow: "0 1px 5px rgba(0,0,0,0.06)",
            maxWidth: 600,
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 20 }}>
              Add User
            </h3>
            <form onSubmit={handleAddUser} style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Full Name"
                style={inputStyle}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="Email"
                style={inputStyle}
              />
              <select
                name="role"
                value={form.role}
                onChange={handleFormChange}
                style={{ ...inputStyle, minWidth: 120 }}
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                type="submit"
                style={{
                  background: "var(--button-bg)",
                  color: "var(--button-text)",
                  fontWeight: 700,
                  padding: "9px 23px",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 17,
                  transition: "background 0.19s",
                  cursor: "pointer",
                }}
              >Add</button>
            </form>
            <div style={{ color: "#b71c1c", marginTop: 8, minHeight: 20, fontSize: 15 }}>
              {formError}
            </div>
          </div>
        </>
      )}

      {/* Reporting section */}
      {view === "report" && (
        <div>
          <AttendanceReport />
        </div>
      )}
    </div>
  );
}

/**
 * Renders a summary card for quick stats.
 */
function SummaryCard({ label, value, color }) {
  return (
    <div style={{
      flex: "1 1 160px",
      minWidth: 148,
      padding: "18px 20px",
      background: "var(--bg-secondary)",
      borderRadius: 16,
      boxShadow: "0 1px 7px rgba(0,0,0,0.045)",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 7,
    }}>
      <span style={{ color: "#888", fontSize: 14, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 800, color: color }}>
        {value}
      </span>
    </div>
  );
}

/**
 * User list section with mock attendance and controls.
 */
function UserSection({ users, onRemove, onDeactivate }) {
  return (
    <div style={{
      background: "var(--bg-secondary)",
      borderRadius: 14,
      padding: "22px 22px 14px 22px",
      boxShadow: "0 1px 7px rgba(0,0,0,0.04)",
      marginBottom: 16,
      maxWidth: "100%",
      overflowX: "auto"
    }}>
      <h3 style={{ marginTop: 0, marginBottom: 13, fontSize: 22 }}>
        Users
      </h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--bg-primary)" }}>
            <th style={userThStyle}>Name</th>
            <th style={userThStyle}>Email</th>
            <th style={userThStyle}>Role</th>
            <th style={userThStyle}>Status</th>
            <th style={userThStyle}>Present</th>
            <th style={userThStyle}>Absent</th>
            <th style={userThStyle}>Late</th>
            <th style={userThStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{
              background: user.status === "Inactive"
                ? "rgba(200,0,60,0.07)"
                : "transparent",
              borderBottom: "1px solid var(--border-color)",
              color: user.status === "Inactive" ? "#777" : "var(--text-primary)",
              fontSize: 16.5,
              fontWeight: user.status === "Inactive" ? 400 : 500
            }}>
              <td style={userTdStyle}>{user.name}</td>
              <td style={userTdStyle}>{user.email}</td>
              <td style={userTdStyle}>{user.role}</td>
              <td style={{
                ...userTdStyle,
                fontWeight: 700,
                color: user.status === "Active"
                  ? "#388e3c"
                  : "#b71c1c"
              }}>{user.status}</td>
              <td style={userTdStyle}>{user.present}</td>
              <td style={userTdStyle}>{user.absent}</td>
              <td style={userTdStyle}>{user.late}</td>
              <td style={userTdStyle}>
                <button
                  onClick={() => onDeactivate(user.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: user.status === "Active" ? "#b71c1c" : "#43a047",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: "3px 8px",
                    marginRight: 4,
                    fontSize: 15,
                  }}
                  title={
                    user.status === "Active"
                      ? "Deactivate user"
                      : "Reactivate user"
                  }
                >
                  {user.status === "Active" ? "Deactivate" : "Reactivate"}
                </button>
                <button
                  onClick={() => onRemove(user.id)}
                  style={{
                    background: "#b71c1c",
                    color: "white",
                    border: "none",
                    borderRadius: 5,
                    padding: "3px 8px",
                    fontWeight: 700,
                    marginLeft: 3,
                    cursor: "pointer",
                  }}
                  title="Remove user"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={8}
                style={{ textAlign: "center", padding: 18, fontSize: 17, color: "#b71c1c" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 14 }}>
        <span>Showing {users.length} user{users.length === 1 ? "" : "s"}.</span>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "9px 16px",
  fontSize: 16,
  borderRadius: 6,
  border: "1px solid var(--border-color)",
  background: "var(--bg-primary)",
  color: "var(--text-primary)",
  minWidth: 120,
  outline: "none",
};

const userThStyle = {
  padding: "10px 10px",
  textAlign: "left",
  fontWeight: 700,
  color: "var(--text-secondary)",
  fontSize: 15,
  borderBottom: "2px solid var(--border-color)",
  background: "transparent"
};
const userTdStyle = {
  padding: "9px 10px",
  color: "var(--text-primary)",
  fontSize: 16.5,
};

export default AdminDashboard;
