import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router';
import Dashboard from './components/Dashboard';
import Order from './components/Order';
import Reservations from './components/Reservations';
import Tables from './components/Tables';
import Inventory from './components/Inventory';
import './Styles/Dashboard.css';

const sidebarLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/orders', label: 'Orders', icon: '🧾' },
  { to: '/reservations', label: 'Reservations', icon: '📅' },
  { to: '/tables', label: 'Tables', icon: '🍽️' },
  { to: '/inventory', label: 'Inventory', icon: '📦' },
];

function App() {
  return (
    <Router>
      <div className="app-layout">
        <aside className="sidebar improved-sidebar">
          <h2>Resto</h2>
          <nav>
            <ul>
              {sidebarLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      isActive ? 'sidebar-link active' : 'sidebar-link'
                    }
                  >
                    <span className="sidebar-link-icon">{link.icon}</span>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
