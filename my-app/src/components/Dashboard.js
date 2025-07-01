import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, getInventory, getReservations, getTables, markOrderComplete, deleteOrder } from '../config/api';
import '../Styles/Dashboard.css';
import Order from './Order';
import Reservations from './Reservations';
import { MdReceiptLong, MdEventSeat, MdFastfood, MdDelete, MdCheckCircle, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    orders: 0,
    inventory: 0,
    reservations: 0,
    tables: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeOrders, setActiveOrders] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    fetchOrdersList();
    fetchActiveReservations();
    fetchLowStockItems();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, inventoryRes, reservationsRes, tablesRes] = await Promise.all([
        getOrders(),
        getInventory(),
        getReservations(),
        getTables()
      ]);

      setStats({
        orders: ordersRes.data.length,
        inventory: inventoryRes.data.length,
        reservations: reservationsRes.data.length,
        tables: tablesRes.data.length
      });
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersList = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      setOrders([]);
    }
  };

  const fetchActiveOrders = async () => {
    try {
      const res = await getOrders();
      setActiveOrders(res.data.filter(order => !order.completed));
    } catch (err) {
      setActiveOrders([]);
    }
  };

  const fetchActiveReservations = async () => {
    try {
      const res = await getReservations();
      const now = new Date();
      setActiveReservations(res.data.filter(reservation => {
        const reservationDate = new Date(reservation.date);
        return reservationDate >= now;
      }));
    } catch (err) {
      setActiveReservations([]);
    }
  };

  const fetchLowStockItems = async () => {
    try {
      const res = await getInventory();
      setLowStockItems(res.data.filter(item => item.quantity !== undefined && item.quantity < 2));
    } catch (err) {
      setLowStockItems([]);
    }
  };

  const handleCompleteOrder = async (id) => {
    try {
      await markOrderComplete(id);
      fetchOrdersList();
      fetchDashboardStats();
    } catch (err) {
      alert('Failed to mark order as complete');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await deleteOrder(id);
      fetchOrdersList();
      fetchDashboardStats();
    } catch (err) {
      alert('Failed to delete order');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isPastReservation = (reservation) => {
    if (!reservation.date || !reservation.time) return false;
    const dateTime = new Date(reservation.date + 'T' + reservation.time);
    return dateTime < new Date();
  };

  const dashboardCards = [
    {
      title: 'Orders Management',
      description: 'Create and manage customer orders',
      icon: '🧾',
      stats: stats.orders,
      statsLabel: 'Total Orders',
      color: 'orders',
      path: '/orders',
      action: 'Manage Orders',
      features: ['Create new orders', 'Track order status', 'View order history']
    },
    {
      title: 'Inventory Management',
      description: 'Manage restaurant inventory and menu items',
      icon: '📦',
      stats: stats.inventory,
      statsLabel: 'Items in Stock',
      color: 'inventory',
      path: '/inventory',
      action: 'Manage Inventory',
      features: ['Add menu items', 'Track stock levels', 'Manage categories']
    },
    {
      title: 'Reservations',
      description: 'Handle table reservations and bookings',
      icon: '📅',
      stats: stats.reservations,
      statsLabel: 'Active Reservations',
      color: 'reservations',
      path: '/reservations',
      action: 'Manage Reservations',
      features: ['Book tables', 'View schedule', 'Manage bookings']
    },
    {
      title: 'Tables Management',
      description: 'Manage restaurant tables and seating',
      icon: '🪑',
      stats: stats.tables,
      statsLabel: 'Available Tables',
      color: 'tables',
      path: '/tables',
      action: 'Manage Tables',
      features: ['Configure tables', 'Set capacities', 'Track availability']
    }
  ];

  const getColorClass = (color) => {
    const colorMap = {
      orders: 'orders-theme',
      inventory: 'inventory-theme',
      reservations: 'reservations-theme',
      tables: 'tables-theme'
    };
    return colorMap[color] || 'orders-theme';
  };

  const getGradientClass = (color) => {
    const gradientMap = {
      orders: 'orders-gradient',
      inventory: 'inventory-gradient',
      reservations: 'reservations-gradient',
      tables: 'tables-gradient'
    };
    return gradientMap[color] || 'orders-gradient';
  };

  const unconfirmedOrders = orders.filter(order => !order.completed);
  const confirmedOrders = orders.filter(order => order.completed);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Restaurant Dashboard</h1>
          <p>Welcome to your restaurant management system</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Restaurant Dashboard</h1>
          <p>Welcome to your restaurant management system</p>
        </div>
        <div className="header-actions">
          <button 
            className="refresh-btn"
            onClick={() => { fetchDashboardStats(); fetchOrdersList(); fetchActiveReservations(); fetchLowStockItems(); }}
            title="Refresh"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          {error}
        </div>
      )}

      <div className="dashboard-split">
        <div className="section-card">
          <div className="section-header">
            <MdReceiptLong size={26} className="section-icon" />
            <h2>Unconfirmed Orders</h2>
          </div>
          {unconfirmedOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><MdReceiptLong size={40} /></div>
              <h3>No Unconfirmed Orders</h3>
              <p>All orders are confirmed!</p>
            </div>
          ) : (
            <div className="orders-list">
              {unconfirmedOrders.map(order => (
                <div key={order._id} className="order-card-dashboard">
                  <div className="order-info-row">
                    <span className="order-foods">{order.name}</span>
                    <span className="order-table">Table #{order.table}</span>
                    <span className="order-price">${order.totalprice}</span>
                    <button className="complete-btn" onClick={e => { e.stopPropagation(); handleCompleteOrder(order._id); }}>
                      <MdCheckCircle style={{ marginRight: 4 }} /> Confirm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="section-card">
          <div className="section-header">
            <MdReceiptLong size={26} className="section-icon" />
            <h2>Confirmed Orders</h2>
          </div>
          {confirmedOrders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><MdReceiptLong size={40} /></div>
              <h3>No Confirmed Orders</h3>
              <p>No orders have been confirmed yet!</p>
            </div>
          ) : (
            <div className="orders-list">
              {confirmedOrders.map(order => (
                <div key={order._id} className="order-card-dashboard order-completed">
                  <div className="order-info-row">
                    <span className="order-foods">{order.name}</span>
                    <span className="order-table">Table #{order.table}</span>
                    <span className="order-price">${order.totalprice}</span>
                    <div className="order-actions-group">
                      <span className="done-badge"><MdCheckCircle style={{ marginRight: 4 }} /> Done</span>
                      <button className="delete-btn icon-btn" title="Delete Order" onClick={e => { e.stopPropagation(); setConfirmDelete({ open: true, id: order._id, name: order.name }); }}>
                        <MdDelete style={{ marginRight: 4 }} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="section-card">
        <div className="section-header">
          <MdEventSeat size={26} className="section-icon" />
          <h2>Active Reservations</h2>
        </div>
        {activeReservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><MdEventSeat size={40} /></div>
            <h3>No Active Reservations</h3>
            <p>All reservations are in the past!</p>
          </div>
        ) : (
          <div className="reservations-list">
            {activeReservations.map(reservation => (
              <div key={reservation._id} className="reservation-card-dashboard">
                <div className="reservation-info-row">
                  <span className="reservation-name">{reservation.name || 'Anonymous'}</span>
                  <span className="reservation-table">Table #{reservation.table}</span>
                  <span className="reservation-date">{new Date(reservation.date).toLocaleDateString()}</span>
                  <span className="reservation-time">{reservation.time}</span>
                  {isPastReservation(reservation) && (
                    <span className="confirmed-badge"><MdCheckCircle style={{ marginRight: 4 }} /> Confirmed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="alert-section">
        <h3 className="alert-title"><span className="alert-icon"><MdFastfood /></span> Low Stock Alert</h3>
        {lowStockItems.length === 0 ? (
          <div className="no-alerts">All food items are sufficiently stocked.</div>
        ) : (
          <ul className="alert-list">
            {lowStockItems.map(item => (
              <li key={item._id} className="alert-item">
                <span className="alert-food-name">{item.name}</span>
                <span className="alert-food-qty">Qty: {item.quantity || 0}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {orderModalOpen && (
        <Order
          dashboardModal
          onClose={() => setOrderModalOpen(false)}
        />
      )}
      {reservationModalOpen && (
        <Reservations
          dashboardModal
          onClose={() => setReservationModalOpen(false)}
        />
      )}
      {confirmDelete.open && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete({ open: false, id: null, name: '' })}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={() => setConfirmDelete({ open: false, id: null, name: '' })}>×</button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="warning-icon">⚠️</span>
                <p>Are you sure you want to delete the order <strong>"{confirmDelete.name}"</strong>?</p>
                <p className="warning-text">This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDelete({ open: false, id: null, name: '' })}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { handleDeleteOrder(confirmDelete.id); setConfirmDelete({ open: false, id: null, name: '' }); }}>Delete Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
