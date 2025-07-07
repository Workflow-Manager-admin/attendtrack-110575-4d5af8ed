import React, { useState, useEffect } from 'react';
import './App.css';

// Feature imports
import EmployeeCheckin from './components/EmployeeCheckin';
import AttendanceHistory from './components/AttendanceHistory';
import AdminDashboard from './pages/AdminDashboard';
import AttendanceReport from './components/AttendanceReport';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application entry. Displays key feature placeholders.
   */
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Theme toggle button */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1>Attendance Tracker System</h1>
        <p>
          {`This is an initial scaffold of the main features. The UI will be expanded with routing and controls.`}
        </p>
        <section style={{
          margin: '2rem auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          width: 'min(95vw, 600px)',
        }}>
          {/* Employee area (shown to all users for now) */}
          <EmployeeCheckin />
          <AttendanceHistory />
          <hr style={{ width: "100%", border: "1px solid var(--border-color)" }} />
          {/* Admin area (shown for structure - routing/roles to be added later) */}
          <AdminDashboard />
          <AttendanceReport />
        </section>
        <footer style={{marginTop: 32, fontSize: 14, color: 'var(--text-secondary)'}}>
          <span>Built with React | Theme: {theme}</span>
        </footer>
      </header>
    </div>
  );
}

export default App;
