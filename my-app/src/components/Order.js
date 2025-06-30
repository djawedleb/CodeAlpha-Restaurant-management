import React, { useEffect, useState } from 'react';
import { getOrders, addOrder, deleteOrder, updateOrder } from '../config/api';
import '../Styles/Order.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [orderName, setOrderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    getOrders()
      .then(res => setOrders(res.data))
      .catch(() => setError('Failed to fetch orders'))
      .finally(() => setLoading(false));
  };

  const openModal = (id = null, name = '') => {
    setEditId(id);
    setOrderName(name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditId(null);
    setOrderName('');
    setModalOpen(false);
  };

  const handleSave = () => {
    setLoading(true);
    const action = editId
      ? updateOrder(editId, { name: orderName })
      : addOrder({ name: orderName });
    action
      .then(() => {
        closeModal();
        fetchOrders();
      })
      .catch(() => setError('Failed to save order'))
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoading(true);
    deleteOrder(confirmDelete.id)
      .then(() => {
        setConfirmDelete({ open: false, id: null });
        fetchOrders();
      })
      .catch(() => setError('Failed to delete order'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="order-container">
      <h1>Orders</h1>
      <button className="dashboard-add-btn" onClick={() => openModal()}>+ Add Order</button>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && orders.length === 0 && <div className="empty-state">No orders found.</div>}
      <ul className="order-list">
        {orders.map(order => (
          <li key={order._id} className="order-item">
            {order.name}
            <button onClick={() => openModal(order._id, order.name)}>Edit</button>
            <button onClick={() => setConfirmDelete({ open: true, id: order._id })}>Delete</button>
          </li>
        ))}
      </ul>
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editId ? 'Edit Order' : 'Add Order'}</h2>
            <input
              value={orderName}
              onChange={e => setOrderName(e.target.value)}
              placeholder="Order name"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={handleSave} className="dashboard-add-btn">
                {editId ? 'Save' : 'Add'}
              </button>
              <button onClick={closeModal} className="dashboard-add-btn" style={{ background: '#fff', color: '#e63946' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confirm Delete */}
      {confirmDelete.open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this order?</p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="dashboard-add-btn">Delete</button>
              <button onClick={() => setConfirmDelete({ open: false, id: null })} className="dashboard-add-btn" style={{ background: '#fff', color: '#e63946' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
