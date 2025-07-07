import React from "react";

/**
 * Example mock attendance records — in a real app this would come from a backend.
 */
const mockAttendanceHistory = [
  {
    date: "2024-06-25",
    checkIn: "08:56 AM",
    checkOut: "05:10 PM",
    status: "Present"
  },
  {
    date: "2024-06-24",
    checkIn: "09:04 AM",
    checkOut: "05:01 PM",
    status: "Present"
  },
  {
    date: "2024-06-23",
    checkIn: "08:50 AM",
    checkOut: "—",
    status: "Absent"
  },
  {
    date: "2024-06-22",
    checkIn: "09:10 AM",
    checkOut: "05:15 PM",
    status: "Present"
  },
  {
    date: "2024-06-21",
    checkIn: "08:59 AM",
    checkOut: "04:59 PM",
    status: "Present"
  },
];

// PUBLIC_INTERFACE
function AttendanceHistory() {
  /**
   * Employee Attendance History view.
   * Shows mock data in a modern styled table.
   */
  return (
    <section
      style={{
        background: "var(--bg-secondary)",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        padding: "1.25rem 1.5rem 2rem 1.5rem",
        margin: "0 0 10px 0",
        width: "100%",
        overflow: "auto",
      }}
    >
      <h2 style={{
        marginTop: 0,
        marginBottom: 22,
        fontSize: 23,
        fontWeight: 700,
        letterSpacing: ".5px",
        color: "var(--text-primary)"
      }}>Attendance History</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "transparent",
        }}
      >
        <thead>
          <tr style={{
            background: "var(--bg-primary)",
            borderBottom: "2.5px solid var(--border-color)"
          }}>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Check-In</th>
            <th style={thStyle}>Check-Out</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {mockAttendanceHistory.map((rec, idx) => (
            <tr
              key={rec.date}
              style={{
                background:
                  idx % 2 === 0 ? "rgba(200,220,255,0.08)" : "transparent",
                borderBottom: "1px solid var(--border-color)",
                fontSize: 17,
              }}
            >
              <td style={tdStyle}>{rec.date}</td>
              <td style={tdStyle}>{rec.checkIn}</td>
              <td style={tdStyle}>{rec.checkOut}</td>
              <td style={{
                ...tdStyle,
                fontWeight: 600,
                padding: "4px 0",
              }}>
                <span className={
                  rec.status === "Present"
                    ? "status-badge status-present"
                    : rec.status === "Absent"
                    ? "status-badge status-absent"
                    : "status-badge"
                }>
                  {rec.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop: 24, textAlign: "right", color: "var(--text-secondary)", fontSize: 14}}>
        Showing latest {mockAttendanceHistory.length} days.
      </div>
    </section>
  );
}

const thStyle = {
  padding: "10px 14px",
  textAlign: "left",
  fontWeight: 700,
  color: "var(--color-secondary)",
  fontSize: 16,
  borderBottom: "2px solid var(--color-primary)",
  background: "var(--table-header-bg)",
};

const tdStyle = {
  padding: "9px 14px",
  color: "var(--text-primary)",
  fontSize: 17,
  background: "transparent"
};

export default AttendanceHistory;
