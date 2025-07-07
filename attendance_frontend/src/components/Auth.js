import React, { useState } from "react";

/**
 * Demo users for easy login (email, password, role)
 */
const DEMO_ACCOUNTS = [
  {
    email: "demo.employee@company.com",
    password: "employee123",
    role: "employee",
    name: "Employee Demo"
  },
  {
    email: "demo.admin@company.com",
    password: "admin123",
    role: "admin",
    name: "Admin Demo"
  }
];

/**
 * Keys for localStorage
 */
const LS_USERS_KEY = "attendance_users";
const LS_AUTH_KEY = "attendance_auth";

/**
 * Returns users from localStorage or initial with demo accounts.
 */
function loadUsers() {
  try {
    const data = JSON.parse(localStorage.getItem(LS_USERS_KEY));
    if (Array.isArray(data) && data.length > 0)
      return [...data];
    // Seed demo accounts if not present
    return [...DEMO_ACCOUNTS];
  } catch {
    return [...DEMO_ACCOUNTS];
  }
}

/**
 * Saves all users to localStorage.
 */
function saveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}

/**
 * Gets authenticated user from localStorage or null.
 */
function getAuthenticatedUser() {
  try {
    const data = JSON.parse(localStorage.getItem(LS_AUTH_KEY));
    if (data && data.email) return data;
  } catch {}
  return null;
}

/**
 * Saves authenticated user to localStorage.
 */
function setAuthenticatedUser(user) {
  localStorage.setItem(LS_AUTH_KEY, JSON.stringify(user));
}

/**
 * Clears authenticated user from localStorage.
 */
function logoutUser() {
  localStorage.removeItem(LS_AUTH_KEY);
}

/**
 * Registration & Login UI + user state management
 * PUBLIC_INTERFACE
 */
function AuthScreen({ onAuth }) {
  // Form mode: login or register
  const [tab, setTab] = useState("login");
  // Current form state
  const [form, setForm] = useState({
    email: "", password: "", name: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Load users for validation; persist new registration.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      let users = loadUsers();
      if (tab === "login") {
        const user = users.find(
          u => u.email === form.email && u.password === form.password
        );
        if (!user) {
          setError("Invalid credentials. Try again.");
        } else {
          setAuthenticatedUser(user);
          onAuth(user);
        }
      } else {
        // Registration
        if (!form.name.trim()) {
          setError("Name is required.");
        } else if (!form.email.trim().match(/^[^@]+@[^@]+\.[^@]+$/)) {
          setError("Valid email required.");
        } else if (form.password.length < 6) {
          setError("Password must be at least 6 characters.");
        } else if (users.some(u => u.email === form.email)) {
          setError("Email already registered.");
        } else {
          const newUser = {
            name: form.name,
            email: form.email,
            password: form.password,
            role: "employee"
          };
          users.push(newUser);
          saveUsers(users);
          setAuthenticatedUser(newUser);
          onAuth(newUser);
        }
      }
      setLoading(false);
    }, 450);
  }

  /**
   * Quickly fill form with demo account.
   */
  function fillDemoAccount(role) {
    const demoUser = DEMO_ACCOUNTS.find(u => u.role === role);
    if (demoUser) {
      setForm({
        email: demoUser.email,
        password: demoUser.password,
        name: ""
      });
      setTab("login");
      setError("");
    }
  }

  return (
    <section
      style={{
        background: "var(--bg-secondary)",
        borderRadius: 20,
        boxShadow: "0 2px 12px rgba(25,118,210,0.10)",
        padding: "2.2rem 1.7rem 1.8rem 1.7rem",
        maxWidth: 350,
        margin: "54px auto 0 auto",
        minWidth: 280,
      }}
    >
      <div style={{ display: "flex", gap: 20, marginBottom: 28, justifyContent: "center" }}>
        <button
          type="button"
          className="btn"
          style={{
            minWidth: 120,
            background: tab === "login" ? "var(--button-bg)" : "var(--bg-secondary)",
            color: tab === "login" ? "var(--button-text)" : "var(--text-secondary)",
            fontWeight: 700,
            boxShadow: tab === "login" ? "0 2px 12px rgba(25, 118, 210, 0.06)" : "none",
            opacity: tab === "login" ? 1 : 0.7,
            outline: 0,
          }}
          onClick={() => { setTab("login"); setError(""); }}
        >
          Login
        </button>
        <button
          type="button"
          className="btn"
          style={{
            minWidth: 120,
            background: tab === "register" ? "var(--button-accent-bg)" : "var(--bg-secondary)",
            color: tab === "register" ? "var(--button-accent-text)" : "var(--text-secondary)",
            fontWeight: 700,
            boxShadow: tab === "register" ? "0 2px 12px rgba(251,192,45,0.08)" : "none",
            opacity: tab === "register" ? 1 : 0.7,
            outline: 0,
          }}
          onClick={() => { setTab("register"); setError(""); }}
        >
          Register
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {tab === "register" && (
          <input
            type="text"
            name="name"
            value={form.name}
            placeholder="Full Name"
            autoComplete="name"
            required
            style={inputStyle}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Email"
          autoComplete="username"
          required
          style={inputStyle}
          disabled={loading}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          required
          minLength={6}
          autoComplete={tab === "login" ? "current-password" : "new-password"}
          disabled={loading}
          style={inputStyle}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="btn"
          style={{
            ...inputStyle,
            background: tab === "login" ? "var(--button-bg)" : "var(--button-accent-bg)",
            color: tab === "login" ? "var(--button-text)" : "var(--button-accent-text)",
            minWidth: 120,
            marginTop: 9
          }}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (tab === "login" ? "Logging in..." : "Registering...") : (tab === "login" ? "Login" : "Register")}
        </button>
        <div style={{ color: "#b71c1c", minHeight: 20, fontSize: 15 }}>
          {error}
        </div>
      </form>
      <hr style={{ margin: "25px 0 14px 0", border: "none", borderTop: "1.3px solid var(--border-color)" }} />
      <div style={{ marginBottom: 3, fontSize: 15, color: "var(--text-secondary)", textAlign: "center" }}>
        Try demo accounts:
      </div>
      <div style={{ display: "flex", gap: 13, justifyContent: "center", marginBottom: 6 }}>
        <button
          className="btn"
          style={{ ...demoBtnStyle, background: "var(--button-bg)", color: "var(--button-text)" }}
          type="button"
          onClick={() => fillDemoAccount("employee")}
        >
          Demo Employee
        </button>
        <button
          className="btn"
          style={{ ...demoBtnStyle, background: "var(--button-accent-bg)", color: "var(--button-accent-text)" }}
          type="button"
          onClick={() => fillDemoAccount("admin")}
        >
          Demo Admin
        </button>
      </div>
      <div style={{
        color: "var(--text-muted)",
        fontSize: 12.5, marginTop: 2, textAlign: "center"
      }}>
        employee: demo.employee@company.com / employee123 <br />
        admin: demo.admin@company.com / admin123
      </div>
    </section>
  );
}

const inputStyle = {
  padding: "11px 14px",
  fontSize: 16,
  borderRadius: 8,
  border: "1.5px solid var(--border-color)",
  background: "var(--bg-primary)",
  color: "var(--text-primary)",
  marginBottom: 0,
  outline: "none"
};

const demoBtnStyle = {
  minWidth: 107,
  fontSize: 15.5,
  fontWeight: 600,
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  boxShadow: "0 1px 5px rgba(25, 118, 210, 0.04)",
  padding: "7px 9px"
};

// PUBLIC_INTERFACE
export {
  AuthScreen,
  loadUsers,
  saveUsers,
  getAuthenticatedUser,
  setAuthenticatedUser,
  logoutUser,
  DEMO_ACCOUNTS
};
