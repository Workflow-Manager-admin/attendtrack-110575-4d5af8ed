import React, { useState } from "react";

/**
 * Mock attendance data for all users (admin view).
 * In a real application, this would be fetched from the backend.
 */
const mockAttendanceRecords = [
  {
    id: 101,
    name: "Alice Johnson",
    date: "2024-06-24",
    checkIn: "08:55 AM",
    checkOut: "05:10 PM",
    status: "Present"
  },
  {
    id: 102,
    name: "Bob Smith",
    date: "2024-06-24",
    checkIn: "09:02 AM",
    checkOut: "05:05 PM",
    status: "Present"
  },
  {
    id: 103,
    name: "Maya Lee",
    date: "2024-06-24",
    checkIn: "-",
    checkOut: "-",
    status: "Absent"
  },
  {
    id: 104,
    name: "Tariq Hassan",
    date: "2024-06-24",
    checkIn: "08:47 AM",
    checkOut: "05:08 PM",
    status: "Present"
  },
  {
    id: 101,
    name: "Alice Johnson",
    date: "2024-06-23",
    checkIn: "08:57 AM",
    checkOut: "05:01 PM",
    status: "Present"
  },
  {
    id: 103,
    name: "Maya Lee",
    date: "2024-06-23",
    checkIn: "-",
    checkOut: "-",
    status: "Absent"
  }
];

// PUBLIC_INTERFACE
function AttendanceReport() {
  /**
   * Attendance Report and export feature for admin users.
   * Shows mock attendance table with a Download CSV button.
   */
  const [exporting, setExporting] = useState(false);

  // PUBLIC_INTERFACE
  // Utility: converts rows array-of-objects to CSV string
  function toCSV(rows) {
    if (!rows?.length) return "";
    const header = Object.keys(rows[0]);
    const csvRows = [
      header.join(","),
      ...rows.map(row => header.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","))
    ];
    return csvRows.join("\r\n");
  }

  // PUBLIC_INTERFACE
  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      const csvData = toCSV(
        mockAttendanceRecords.map(r => ({
          "Employee": r.name,
          "Date": r.date,
          "Check-In": r.checkIn,
          "Check-Out": r.checkOut,
          "Status": r.status
        }))
      );
      // Download logic: create blob and trigger link
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance-report-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExporting(false);
    }, 350); // Quick loading state for UX
  };

  return (
    <section style={{
      background: "var(--bg-secondary)",
      borderRadius: 16,
      boxShadow: "0 1px 9px rgba(0,0,0,0.04)",
      padding: "22px 20px 16px 28px",
      width: "100%",
      maxWidth: 880,
      overflow: "auto",
      margin: "0 auto"
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 12, flexWrap: "wrap", gap: 6
      }}>
        <h2 style={{
          margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: ".5px", color: "var(--text-primary)"
        }}>
          Attendance Report
        </h2>
        <button
          className="btn"
          style={{
            background: "var(--button-bg)",
            color: "var(--button-text)",
            border: "none",
            borderRadius: 8,
            padding: "9px 22px",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            transition: "background 0.15s",
            opacity: exporting ? 0.7 : 1,
            minWidth: 140
          }}
          onClick={handleExportCSV}
          disabled={exporting}
          aria-busy={exporting}
        >
          {exporting ? "Exporting..." : "Export as CSV"}
        </button>
      </div>
      <div style={{
        width: "100%",
        overflowX: "auto",
        marginTop: 5
      }}>
        <table style={{
          width: "100%",
          minWidth: 630,
          borderCollapse: "collapse",
          background: "transparent"
        }}>
          <thead>
            <tr style={{ background: "var(--bg-primary)", borderBottom: "2.5px solid var(--border-color)" }}>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Check-In</th>
              <th style={thStyle}>Check-Out</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAttendanceRecords.map((rec, idx) => (
              <tr key={rec.id + rec.date} style={{
                background:
                  idx % 2 === 0 ? "rgba(25,118,210,0.06)" : "transparent",
                borderBottom: "1px solid var(--border-color)",
                fontSize: 17
              }}>
                <td style={tdStyle}>{rec.name}</td>
                <td style={tdStyle}>{rec.date}</td>
                <td style={tdStyle}>{rec.checkIn}</td>
                <td style={tdStyle}>{rec.checkOut}</td>
                <td style={{
                  ...tdStyle,
                  fontWeight: 600,
                  padding: "4px 0"
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
            {mockAttendanceRecords.length === 0 && (
              <tr>
                <td colSpan={5} style={{
                  textAlign: "center", padding: "15px 0", fontSize: 17, color: "#b71c1c"
                }}>
                  No attendance records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{
        marginTop: 15, textAlign: "right",
        color: "var(--text-secondary)", fontSize: 14
      }}>
        Showing {mockAttendanceRecords.length} records. Export for CSV download.
      </div>
    </section>
  );
}

const thStyle = {
  padding: "10px 16px",
  textAlign: "left",
  fontWeight: 700,
  color: "var(--color-secondary)",
  fontSize: 16,
  borderBottom: "2px solid var(--color-primary)",
  background: "var(--table-header-bg)"
};

const tdStyle = {
  padding: "8px 16px",
  color: "var(--text-primary)",
  fontSize: 17,
  background: "transparent"
};

export default AttendanceReport;
