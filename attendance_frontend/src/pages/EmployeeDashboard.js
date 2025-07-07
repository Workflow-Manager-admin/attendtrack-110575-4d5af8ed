import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EmployeeCheckin from "../components/EmployeeCheckin";
import LeaveApplication from "../components/LeaveApplication";

// Mock data for leave balance
const mockLeaveBalance = {
  annual: 14,
  sick: 7,
  unpaid: 0,
  total: 21
};

// Mock data for calendar
const generateMockCalendarData = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const calendarData = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    if (date > currentDate) continue; // Don't generate future dates
    
    // Generate random attendance status
    const rand = Math.random();
    let status;
    if (rand > 0.9) status = "absent";
    else if (rand > 0.8) status = "late";
    else status = "present";
    
    calendarData.push({
      date,
      status,
      checkIn: status !== "absent" ? `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` : "-",
      checkOut: status !== "absent" ? `0${5 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM` : "-"
    });
  }
  return calendarData;
};

// PUBLIC_INTERFACE
function EmployeeDashboard() {
  const [calendarData] = useState(generateMockCalendarData());
  const user = JSON.parse(localStorage.getItem("attendance_auth")) || {};

  // Stats based on calendar data
  const stats = {
    present: calendarData.filter(d => d.status === "present").length,
    absent: calendarData.filter(d => d.status === "absent").length,
    late: calendarData.filter(d => d.status === "late").length,
    total: calendarData.length
  };

  return (
    <div className="employee-dashboard" style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem 1rem",
      display: "grid",
      gap: "2rem",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    }}>
      {/* Welcome and Quick Stats */}
      <section style={{
        gridColumn: "1 / -1",
        background: "var(--bg-secondary)",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "var(--shadow-light)",
      }}>
        <h1 style={{
          margin: "0 0 1rem 0",
          fontSize: "1.8rem",
          color: "var(--text-primary)"
        }}>
          Welcome back, {user.name || "Employee"}!
        </h1>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
        }}>
          <StatCard label="Present Days" value={stats.present} color="var(--color-primary)" />
          <StatCard label="Absent Days" value={stats.absent} color="#b71c1c" />
          <StatCard label="Late Days" value={stats.late} color="var(--color-accent)" />
          <StatCard label="Attendance Rate" value={`${Math.round((stats.present / stats.total) * 100)}%`} color="#43a047" />
        </div>
      </section>

      {/* Check-in Section */}
      <section style={{
        background: "var(--bg-secondary)",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "var(--shadow-light)",
      }}>
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.4rem" }}>Attendance</h2>
        <EmployeeCheckin />
      </section>

      {/* Leave Management Section */}
      <section style={{
        gridColumn: "1 / -1",
        background: "var(--bg-secondary)",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "var(--shadow-light)",
      }}>
        <div style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}>
          {/* Leave Balance */}
          <div>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.4rem" }}>Leave Balance</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "1rem",
              marginBottom: "1.5rem"
            }}>
              <LeaveCard type="Annual" balance={mockLeaveBalance.annual} />
              <LeaveCard type="Sick" balance={mockLeaveBalance.sick} />
              <LeaveCard type="Unpaid" balance={mockLeaveBalance.unpaid} />
            </div>
          </div>

          {/* Leave Application */}
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.4rem" }}>Leave Application</h2>
            <LeaveApplication />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section style={{
        background: "var(--bg-secondary)",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "var(--shadow-light)",
      }}>
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.4rem" }}>Quick Links</h2>
        <div style={{
          display: "grid",
          gap: "0.5rem",
        }}>
          <QuickLink icon="📊" label="View Attendance History" />
          <QuickLink icon="📝" label="Request Leave" />
          <QuickLink icon="📋" label="View Reports" />
          <QuickLink icon="⚙️" label="Settings" />
        </div>
      </section>

      {/* Calendar View */}
      <section style={{
        gridColumn: "1 / -1",
        background: "var(--bg-secondary)",
        padding: "1.5rem",
        borderRadius: "16px",
        boxShadow: "var(--shadow-light)",
      }}>
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.4rem" }}>Monthly Attendance</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: "1rem",
          maxHeight: "400px",
          overflowY: "auto",
          padding: "0.5rem",
        }}>
          {calendarData.map((day, index) => (
            <CalendarDay key={index} data={day} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Helper Components

function StatCard({ label, value, color }) {
  return (
    <div style={{
      padding: "1rem",
      background: `${color}11`,
      borderRadius: "12px",
      color: color,
    }}>
      <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>{label}</div>
    </div>
  );
}

function LeaveCard({ type, balance }) {
  return (
    <div style={{
      padding: "1rem",
      background: "var(--bg-primary)",
      borderRadius: "12px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-primary)" }}>
        {balance}
      </div>
      <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{type}</div>
    </div>
  );
}

function QuickLink({ icon, label }) {
  return (
    <Link to="#" style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "0.8rem",
      background: "var(--bg-primary)",
      borderRadius: "8px",
      color: "var(--text-primary)",
      textDecoration: "none",
      transition: "transform 0.2s",
      ":hover": {
        transform: "translateX(5px)",
      }
    }}>
      <span style={{ fontSize: "1.2rem" }}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function CalendarDay({ data }) {
  const statusColors = {
    present: { bg: "rgba(25,118,210,0.1)", text: "var(--color-primary)" },
    absent: { bg: "rgba(183,28,28,0.1)", text: "#b71c1c" },
    late: { bg: "rgba(251,192,45,0.1)", text: "var(--color-accent)" }
  };

  return (
    <div style={{
      padding: "0.8rem",
      background: statusColors[data.status].bg,
      borderRadius: "10px",
      color: statusColors[data.status].text,
    }}>
      <div style={{ fontSize: "0.9rem", marginBottom: "0.3rem" }}>
        {data.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
      <div style={{ fontSize: "0.8rem" }}>
        {data.checkIn} - {data.checkOut}
      </div>
      <div style={{ 
        fontSize: "0.8rem",
        fontWeight: "bold",
        marginTop: "0.3rem",
        textTransform: "capitalize" 
      }}>
        {data.status}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
