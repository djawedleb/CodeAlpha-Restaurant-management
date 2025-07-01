import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router';
import Dashboard from './components/Dashboard';
import Order from './components/Order';
import Reservations from './components/Reservations';
import Tables from './components/Tables';
import Inventory from './components/Inventory';
import './Styles/Dashboard.css';
import { MdDashboard, MdReceiptLong, MdFastfood, MdEventSeat, MdTableBar } from 'react-icons/md';

const sidebarLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <MdDashboard size={22} /> },
  { to: '/orders', label: 'Orders', icon: <MdReceiptLong size={22} /> },
  { to: '/inventory', label: 'Food', icon: <MdFastfood size={22} /> },
  { to: '/reservations', label: 'Reservations', icon: <MdEventSeat size={22} /> },
  { to: '/tables', label: 'Tables', icon: <MdTableBar size={22} /> },
];

function App() {
  return (
    <Router>
      <div className="app-layout">
        <aside className="sidebar improved-sidebar">
          <div className="sidebar-logo">
            <MdFastfood size={32} style={{ color: '#ff7043', marginRight: 8 }} />
            <span className="sidebar-title">RestoManager</span>
          </div>
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
