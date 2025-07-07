import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useLocation } from 'react-router-dom';

// Feature imports
import EmployeeCheckin from './components/EmployeeCheckin';
import AttendanceHistory from './components/AttendanceHistory';
import AdminDashboard from './pages/AdminDashboard';
import AttendanceReport from './components/AttendanceReport';
import { AuthScreen, getAuthenticatedUser, logoutUser } from './components/Auth';

/** 
 * Side navigation for Admin Section
 */
function AdminSideNav() {
  const location = { pathname: window.location.pathname };
  return (
    <nav className="admin-sidenav" style={{
      minWidth: 220,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      padding: '2rem 1rem',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <h2 style={{margin: 0, fontSize: 22}}>Admin</h2>
      <span
        className={`admin-side-link${location.pathname === '/admin/dashboard' ? ' active' : ''}`}
        style={{
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontWeight: 500,
          margin: '4px 0'
        }}
      >
        Dashboard
      </span>
      <span
        className={`admin-side-link${location.pathname === '/admin/report' ? ' active' : ''}`}
        style={{
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontWeight: 500,
          margin: '4px 0'
        }}
      >
        Attendance Report
      </span>
    </nav>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application entry point w/ authentication and theming.
   */
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(() => getAuthenticatedUser()); // {email, role, name}

  // Apply theme preference
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleAuth = (userObj) => {
    setUser(userObj);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  // Application-wide header
  function AppHeader() {
    return (
      <header className="main-header"
        style={{
          width: '100%',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 0.5rem 1rem 1.5rem',
          background: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 60
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <span className="logo" style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)' }}>
            Attendance Tracker
          </span>
          {user && (
            <nav>
              <span
                className="nav-link"
                style={{
                  padding: '0 1rem',
                  color: user.role === "employee" ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textDecoration: user.role === "employee" ? 'underline' : 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => setUser({ ...user, role: "employee" })}
              >
                Employee Portal
              </span>
              <span
                className="nav-link"
                style={{
                  padding: '0 1rem',
                  color: user.role === "admin" ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textDecoration: user.role === "admin" ? 'underline' : 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onClick={() => setUser({ ...user, role: "admin" })}
              >
                Admin
              </span>
            </nav>
          )}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        {user && (
          <button
            className="btn"
            style={{
              background: "var(--color-secondary)",
              color: "#fff",
              fontSize: 15,
              borderRadius: 8,
              border: "none",
              fontWeight: 700,
              padding: "7px 22px",
              marginLeft: 8,
              cursor: "pointer"
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
        </div>
      </header>
    );
  }

  // Application-wide footer
  function AppFooter() {
    return (
      <footer
        style={{
          marginTop: 16, padding: 16, textAlign: 'center',
          color: 'var(--text-secondary)', fontSize: 14
        }}
      >
        <span>Built with React | Theme: {theme}</span>
      </footer>
    );
  }

  // Main: Show authentication or user-specific UI
  if (!user) {
    return (
      <div className="App">
        <AppHeader />
        <AuthScreen onAuth={handleAuth} />
        <AppFooter />
      </div>
    );
  }

  // If employee role: show employee dashboard
  if (user.role === "employee") {
    return (
      <div className="App">
        <AppHeader />
        <main className="employee-main"
          style={{
            maxWidth: 600,
            margin: '2rem auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}>
          <EmployeeCheckin />
          <AttendanceHistory />
        </main>
        <AppFooter />
      </div>
    );
  }

  // If admin role: show admin dashboard
  return (
    <div className="App">
      <AppHeader />
      <div
        className="admin-dashboard-layout"
        style={{
          display: 'flex',
          minHeight: 'calc(100vh - 60px)',
          background: 'var(--bg-primary)',
        }}
      >
        <AdminSideNav />
        <main className="admin-content" style={{ flex: 1, padding: '2.5rem 2.5rem 2.5rem 2.5rem', minHeight: '100vh' }}>
          <AdminDashboard />
        </main>
      </div>
      <AppFooter />
    </div>
  );
}

export default App;
