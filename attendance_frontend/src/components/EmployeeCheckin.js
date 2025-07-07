import React, { useState, useEffect } from "react";

/**
 * Key for persistent localStorage state.
 */
const CHECKIN_KEY = "employee_checkin_status";

// PUBLIC_INTERFACE
function EmployeeCheckin() {
  /**
   * Employee Check-In/Check-Out widget.
   * Tracks local 'checked in' status, persisted to localStorage.
   * Shows current status and lets employee check in or out for the day.
   */
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timestamp, setTimestamp] = useState(null);

  // Load check-in status from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CHECKIN_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIsCheckedIn(parsed.status === "in");
        if (parsed.time) {
          setTimestamp(parsed.time);
        }
      } catch {
        // Ignore parse error & fallback to default
      }
    }
  }, []);

  // Save check-in status whenever status or timestamp changes
  useEffect(() => {
    const data = {
      status: isCheckedIn ? "in" : "out",
      time: timestamp
    };
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(data));
  }, [isCheckedIn, timestamp]);

  // PUBLIC_INTERFACE
  const handleCheckin = () => {
    setIsCheckedIn(true);
    setTimestamp(new Date().toISOString());
  };

  // PUBLIC_INTERFACE
  const handleCheckout = () => {
    setIsCheckedIn(false);
    setTimestamp(new Date().toISOString());
  };

  return (
    <section style={{
      textAlign: "center",
      marginBottom: "1rem"
    }}
    >
      <h2 style={{marginTop: 0, marginBottom: 16}}>Employee Check-In/Check-Out</h2>
      <div style={{marginBottom: 20, fontSize: 18}}>
        {isCheckedIn 
          ? (
            <span role="status" style={{color: "#2e7d32", fontWeight: 500}}>
              ✅ Checked In
            </span>
          )
          : (
            <span role="status" style={{color: "#b71c1c", fontWeight: 500}}>
              ⏳ Not Checked In
            </span>
          )
        }
      </div>
      <div style={{marginBottom:12, color:"var(--text-secondary)", fontSize: 15}}>
        {timestamp ? (
          <>Last action: <span style={{fontWeight: 500}}>{new Date(timestamp).toLocaleString()}</span></>
        ) : (
          <>No check-in/out today.</>
        )}
      </div>
      {/* Button group */}
      {isCheckedIn ? (
        <button
          className="btn"
          onClick={handleCheckout}
          style={{
            background: "var(--button-bg)",
            color: "var(--button-text)",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 17,
            padding: "0.8rem 2.5rem",
            margin: "0 auto",
            cursor: "pointer",
            transition: "background 0.2s, box-shadow 0.2s"
          }}
        >
          Check Out
        </button>
      ) : (
        <button
          className="btn"
          onClick={handleCheckin}
          style={{
            background: "var(--button-bg)",
            color: "var(--button-text)",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 17,
            padding: "0.8rem 2.5rem",
            margin: "0 auto",
            cursor: "pointer",
            transition: "background 0.2s, box-shadow 0.2s"
          }}
        >
          Check In
        </button>
      )}
    </section>
  );
}

export default EmployeeCheckin;
