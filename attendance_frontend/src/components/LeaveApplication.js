import React, { useState, useEffect } from "react";

/**
 * Key for leave requests in localStorage
 */
const LEAVE_REQUESTS_KEY = "employee_leave_requests";

/**
 * Leave types and their default validation rules
 */
const LEAVE_TYPES = {
  annual: { label: "Annual Leave", maxDays: 14 },
  sick: { label: "Sick Leave", maxDays: 7 },
  unpaid: { label: "Unpaid Leave", maxDays: 30 }
};

// PUBLIC_INTERFACE
function LeaveApplication() {
  /**
   * Leave Application component that handles leave requests with validation.
   * Features:
   * - Form for leave submission
   * - Date validation
   * - Duplicate check
   * - Status tracking
   * - User feedback
   */
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [currentRequest, setCurrentRequest] = useState({
    type: "annual",
    startDate: "",
    endDate: "",
    reason: "",
    status: "pending"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load existing leave requests from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LEAVE_REQUESTS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLeaveRequests(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        console.error("Error loading leave requests:", err);
        setLeaveRequests([]);
      }
    }
  }, []);

  // Save leave requests to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(LEAVE_REQUESTS_KEY, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  // Calculate number of days between two dates (excluding weekends)
  const calculateWorkingDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let days = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  // Check for overlapping leave requests
  const checkOverlap = (start, end) => {
    return leaveRequests.some(request => {
      if (request.status === "rejected") return false;
      const existingStart = new Date(request.startDate);
      const existingEnd = new Date(request.endDate);
      const newStart = new Date(start);
      const newEnd = new Date(end);
      return (
        (newStart >= existingStart && newStart <= existingEnd) ||
        (newEnd >= existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRequest(prev => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!currentRequest.startDate || !currentRequest.endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    const startDate = new Date(currentRequest.startDate);
    const endDate = new Date(currentRequest.endDate);
    const today = new Date();

    // Validate dates
    if (startDate < today) {
      setError("Start date cannot be in the past.");
      return;
    }

    if (endDate < startDate) {
      setError("End date must be after start date.");
      return;
    }

    // Calculate leave duration
    const workingDays = calculateWorkingDays(startDate, endDate);
    if (workingDays <= 0) {
      setError("Please select valid working days (excluding weekends).");
      return;
    }

    // Check against leave type limits
    if (workingDays > LEAVE_TYPES[currentRequest.type].maxDays) {
      setError(`Maximum ${LEAVE_TYPES[currentRequest.type].maxDays} days allowed for ${LEAVE_TYPES[currentRequest.type].label}.`);
      return;
    }

    // Check for overlapping leaves
    if (checkOverlap(startDate, endDate)) {
      setError("You have overlapping leave requests for the selected dates.");
      return;
    }

    // Add new leave request
    const newRequest = {
      ...currentRequest,
      id: Date.now(),
      workingDays,
      appliedOn: new Date().toISOString(),
    };

    setLeaveRequests(prev => [...prev, newRequest]);
    setSuccess("Leave request submitted successfully!");
    
    // Reset form
    setCurrentRequest({
      type: "annual",
      startDate: "",
      endDate: "",
      reason: "",
      status: "pending"
    });
  };

  return (
    <div>
      {/* Leave Application Form */}
      <form onSubmit={handleSubmit} style={{
        display: "grid",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          display: "grid",
          gap: "0.5rem"
        }}>
          <label style={labelStyle}>Leave Type</label>
          <select
            name="type"
            value={currentRequest.type}
            onChange={handleInputChange}
            style={inputStyle}
          >
            {Object.entries(LEAVE_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem"
        }}>
          <div>
            <label style={labelStyle}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={currentRequest.startDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={currentRequest.endDate}
              onChange={handleInputChange}
              min={currentRequest.startDate || new Date().toISOString().split('T')[0]}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Reason</label>
          <textarea
            name="reason"
            value={currentRequest.reason}
            onChange={handleInputChange}
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            placeholder="Please provide a reason for your leave request..."
            required
          />
        </div>

        <button
          type="submit"
          className="btn"
          style={{
            marginTop: "0.5rem",
            background: "var(--button-bg)",
            color: "var(--button-text)"
          }}
        >
          Submit Leave Request
        </button>

        {error && (
          <div style={{
            color: "#b71c1c",
            fontSize: "0.9rem",
            padding: "0.5rem",
            background: "rgba(183,28,28,0.1)",
            borderRadius: "8px"
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            color: "#2e7d32",
            fontSize: "0.9rem",
            padding: "0.5rem",
            background: "rgba(46,125,50,0.1)",
            borderRadius: "8px"
          }}>
            {success}
          </div>
        )}
      </form>

      {/* Leave Requests History */}
      <div>
        <h3 style={{
          fontSize: "1.1rem",
          marginBottom: "1rem"
        }}>Leave Requests History</h3>
        
        <div style={{
          display: "grid",
          gap: "1rem",
          maxHeight: "300px",
          overflowY: "auto",
          padding: "0.5rem"
        }}>
          {leaveRequests.length === 0 ? (
            <div style={{
              color: "var(--text-secondary)",
              textAlign: "center",
              padding: "1rem"
            }}>
              No leave requests found.
            </div>
          ) : (
            leaveRequests.sort((a, b) => b.id - a.id).map(request => (
              <div
                key={request.id}
                style={{
                  padding: "1rem",
                  background: "var(--bg-primary)",
                  borderRadius: "8px",
                  borderLeft: `4px solid ${
                    request.status === "approved" ? "#2e7d32" :
                    request.status === "rejected" ? "#b71c1c" :
                    "var(--color-accent)"
                  }`
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem"
                }}>
                  <span style={{ fontWeight: "600" }}>
                    {LEAVE_TYPES[request.type].label}
                  </span>
                  <span className={`status-badge ${
                    request.status === "approved" ? "status-present" :
                    request.status === "rejected" ? "status-absent" :
                    "status-late"
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <div style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.25rem"
                }}>
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  <span style={{ marginLeft: "0.5rem" }}>
                    ({request.workingDays} working days)
                  </span>
                </div>
                <div style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)"
                }}>
                  {request.reason}
                </div>
                <div style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: "0.5rem"
                }}>
                  Applied on: {new Date(request.appliedOn).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: "0.9rem",
  fontWeight: "500",
  color: "var(--text-secondary)",
  marginBottom: "0.25rem"
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  border: "1.5px solid var(--border-color)",
  borderRadius: "8px",
  background: "var(--bg-primary)",
  color: "var(--text-primary)",
  fontSize: "1rem"
};

export default LeaveApplication;
