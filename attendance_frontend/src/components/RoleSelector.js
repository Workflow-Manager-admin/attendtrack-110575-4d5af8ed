import React from "react";

/**
 * Simple role selector for "mock login" – switches between employee/admin views.
 * Used at application top-level to determine which UI to display.
 * PUBLIC_INTERFACE
 */
function RoleSelector({ role, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: 15,
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "6px 0",
      marginBottom: 8,
      minHeight: 48,
      background: "transparent"
    }}>
      <span style={{
        fontWeight: 500,
        color: "var(--text-secondary)",
        fontSize: 16,
        marginRight: 10
      }}>Select Role:</span>
      <button
        type="button"
        className="btn"
        style={{
          background: role === "employee" ? "var(--button-bg)" : "var(--bg-secondary)",
          color: role === "employee" ? "var(--button-text)" : "var(--text-secondary)",
          border: role === "employee" ? "none" : "1.5px solid var(--border-color)",
          fontWeight: 700,
          borderRadius: 8,
          boxShadow: role === "employee" ? "0 1px 6px rgba(25, 118, 210, 0.03)" : "none",
          opacity: role === "employee" ? 1 : 0.72,
          minWidth: 118
        }}
        aria-pressed={role === "employee"}
        onClick={() => onChange("employee")}
      >
        Employee
      </button>
      <button
        type="button"
        className="btn"
        style={{
          background: role === "admin" ? "var(--button-bg)" : "var(--bg-secondary)",
          color: role === "admin" ? "var(--button-text)" : "var(--text-secondary)",
          border: role === "admin" ? "none" : "1.5px solid var(--border-color)",
          fontWeight: 700,
          borderRadius: 8,
          boxShadow: role === "admin" ? "0 1px 6px rgba(25, 118, 210, 0.03)" : "none",
          opacity: role === "admin" ? 1 : 0.72,
          minWidth: 118
        }}
        aria-pressed={role === "admin"}
        onClick={() => onChange("admin")}
      >
        Admin
      </button>
    </div>
  );
}

export default RoleSelector;
