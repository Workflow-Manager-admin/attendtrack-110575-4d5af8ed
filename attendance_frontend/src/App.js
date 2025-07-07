import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';

// Feature imports
import EmployeeCheckin from './components/EmployeeCheckin';
import AttendanceHistory from './components/AttendanceHistory';
import AdminDashboard from './pages/AdminDashboard';
import AttendanceReport from './components/AttendanceReport';
import RoleSelector from './components/RoleSelector';

// Side navigation for Admin Section
function AdminSideNav() {
  /**
   * Displays side navigation for admin dashboard area.
   */
  const location = useLocation();
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
      <Link
        className={`admin-side-link${location.pathname === '/admin/dashboard' ? ' active' : ''}`}
        to="/admin/dashboard"
        style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500 }}
      >
        Dashboard
      </Link>
      <Link
        className={`admin-side-link${location.pathname === '/admin/report' ? ' active' : ''}`}
        to="/admin/report"
        style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500 }}
      >
        Attendance Report
      </Link>
    </nav>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application entry point for routes, theming, dash layout, and role selection.
   */
  const [theme, setTheme] = useState('light');

  // Persistent role state (default "employee")
  const ROLE_KEY = "attend_role";
  const [role, setRole] = useState(() => {
    const stored = localStorage.getItem(ROLE_KEY);
    if (stored === "admin" || stored === "employee") return stored;
    return "employee";
  });
  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Header/navigation for all users (top bar)
  function AppHeader() {
    const location = useLocation();
    // Show Admin/Employee quick nav for clarity
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
          <nav>
            <Link
              to="/"
              className="nav-link"
              style={{
                padding: '0 1rem',
                color: location.pathname.startsWith('/admin') ? 'var(--text-secondary)' : 'var(--text-primary)',
                textDecoration: location.pathname.startsWith('/admin') ? 'none' : 'underline'
              }}
            >
              Employee Portal
            </Link>
            <Link
              to="/admin/dashboard"
              className="nav-link"
              style={{
                padding: '0 1rem',
                color: location.pathname.startsWith('/admin') ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: location.pathname.startsWith('/admin') ? 'underline' : 'none'
              }}
            >
              Admin
            </Link>
          </nav>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
    );
  }

  // Employee main layout (centered content, no side nav)
  function EmployeeLayout() {
    return (
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
    );
  }

  // Admin dashboard layout: side navigation + main content (dashboard, report)
  function AdminLayout({ children }) {
    return (
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
          {children}
        </main>
      </div>
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

  // Main: Show either employee or admin view, based on role.
  return (
    <div className="App">
      <AppHeader />
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <RoleSelector role={role} onChange={setRole} />
      </div>
      {role === "employee" ? (
        // Employee portal UI (no admin side nav, just the core employee functions)
        <div style={{ width: "100%" }}>
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
        </div>
      ) : (
        // Admin all-in-one (this mirrors the admin dashboard area)
        <div style={{ width: "100%" }}>
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
        </div>
      )}
      <AppFooter />
    </div>
  );
}

export default App;
