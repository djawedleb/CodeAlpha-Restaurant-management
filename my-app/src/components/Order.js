import React, { useEffect, useState } from 'react';
import { getOrders, addOrder, deleteOrder, updateOrder } from '../config/api';
import { getInventory } from '../config/api';
import { getTables } from '../config/api';
import '../Styles/Order.css';
import { MdReceiptLong, MdTableBar, MdFastfood, MdEdit, MdDelete, MdCheckCircle, MdAccessTime } from 'react-icons/md';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    table: '',
    totalprice: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });
  const [foodInventory, setFoodInventory] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response) {
        // Server responded with error status
        setError(`Failed to fetch orders: ${err.response.status} - ${err.response.data || err.response.statusText}`);
      } else if (err.request) {
        // Network error - server not reachable
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        // Other error
        setError('Failed to fetch orders: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await getInventory();
      setFoodInventory(res.data);
    } catch (err) {
      setFoodInventory([]);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await getTables();
      setTables(res.data);
    } catch (err) {
      setTables([]);
    }
  };

  const openModal = (order = null) => {
    fetchInventory();
    fetchTables();
    if (order) {
      setEditId(order._id);
      const selected = order.name ? order.name.split(',').map(n => n.trim()) : [];
      setSelectedFoods(selected);
      setFormData({
        name: order.name || '',
        table: order.table || '',
        totalprice: order.totalprice || ''
      });
    } else {
      setEditId(null);
      setSelectedFoods([]);
      setFormData({
        name: '',
        table: '',
        totalprice: ''
      });
    }
    setModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setEditId(null);
    setFormData({
      name: '',
      table: '',
      totalprice: ''
    });
    setModalOpen(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Order name is required');
      return false;
    }
    if (!formData.table || formData.table <= 0) {
      setError('Table number must be greater than 0');
      return false;
    }
    if (!formData.totalprice || formData.totalprice <= 0) {
      setError('Total price must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const orderData = {
        name: formData.name.trim(),
        table: parseInt(formData.table),
        totalprice: parseFloat(formData.totalprice)
      };

      if (editId) {
        await updateOrder(editId, orderData);
        setSuccess('Order updated successfully!');
      } else {
        await addOrder(orderData);
        setSuccess('Order added successfully!');
      }

      setTimeout(() => {
        closeModal();
        fetchOrders();
      }, 1000);
    } catch (err) {
      setError(editId ? 'Failed to update order' : 'Failed to add order');
      console.error('Error saving order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteOrder(confirmDelete.id);
      setConfirmDelete({ open: false, id: null, name: '' });
      fetchOrders();
    } catch (err) {
      setError('Failed to delete order');
      console.error('Error deleting order:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (foodInventory.length === 0) return;
    const selectedFoodObjs = foodInventory.filter(f => selectedFoods.includes(f.name));
    const total = selectedFoodObjs.reduce((sum, f) => sum + (f.price || 0), 0);
    setFormData(prev => ({
      ...prev,
      name: selectedFoods.join(', '),
      totalprice: total ? total : ''
    }));
  }, [selectedFoods, foodInventory]);

  return (
    <div className="order-container">
      <div className="section-card">
        <div className="section-header">
          <MdReceiptLong size={26} className="section-icon" />
          <h1>Orders Management</h1>
        </div>
        <button className="add-order-btn" onClick={() => openModal()}>
          <MdFastfood size={20} style={{ marginRight: 6 }} /> Add New Order
        </button>
        {loading && !modalOpen && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        )}
        {error && !modalOpen && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        {!loading && orders.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><MdReceiptLong size={40} /></div>
            <h3>No Orders Found</h3>
            <p>Start by adding your first order</p>
            <button className="add-order-btn" onClick={() => openModal()}>
              <MdFastfood size={20} style={{ marginRight: 6 }} /> Add First Order
            </button>
          </div>
        )}
        {!loading && orders.length > 0 && (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header-card">
                  <span className="order-name">
                    <MdFastfood size={20} style={{ marginRight: 4, color: '#ff7043' }} />
                    {order.name}
                  </span>
                  <span className="order-price">${order.totalprice}</span>
                </div>
                <div className="order-details">
                  <div className="order-info">
                    <MdTableBar size={18} style={{ marginRight: 4, color: '#43a047' }} />
                    <span className="info-label">Table:</span>
                    <span className="info-value table-number">#{order.table}</span>
                  </div>
                  <div className="order-info">
                    <MdAccessTime size={18} style={{ marginRight: 4, color: '#ff7043' }} />
                    <span className="info-label">Created:</span>
                    <span className="info-value">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                <div className="order-actions">
                  {order.completed !== true && (
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => openModal(order)}
                      title="Edit Order"
                    >
                      <MdEdit size={18} style={{ marginRight: 4 }} /> Edit
                    </button>
                  )}
                  <button className="delete-btn icon-btn" title="Delete Order" onClick={() => setConfirmDelete({ open: true, id: order._id, name: order.name })}>
                    <MdDelete size={18} style={{ marginRight: 4 }} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Enhanced Modal for Add/Edit */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Order' : 'Add New Order'}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  {error}
                </div>
              )}
              {success && (
                <div className="success-message">
                  <span className="success-icon">✓</span>
                  {success}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="foods">Select Food Items *</label>
                <select
                  id="foods"
                  name="foods"
                  multiple
                  value={selectedFoods}
                  onChange={e => {
                    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    setSelectedFoods(options);
                  }}
                  className="form-input"
                  style={{ minHeight: '80px' }}
                >
                  {foodInventory.map(food => (
                    <option key={food._id} value={food.name}>
                      {food.name} (${food.price})
                    </option>
                  ))}
                </select>
                <small>Hold Ctrl (Windows) or Cmd (Mac) to select multiple items.</small>
              </div>
              <div className="form-group">
                <label htmlFor="table">Table Number *</label>
                <select
                  id="table"
                  name="table"
                  value={formData.table}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select a table</option>
                  {tables.map(table => (
                    <option key={table._id} value={table.number}>
                      Table #{table.number}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="totalprice">Total Price *</label>
                <div className="price-input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    id="totalprice"
                    name="totalprice"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.totalprice}
                    readOnly
                    className="form-input price-input"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    {editId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editId ? 'Update Order' : 'Add Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Enhanced Confirm Delete Modal */}
      {confirmDelete.open && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete({ open: false, id: null, name: '' })}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button 
                className="close-btn" 
                onClick={() => setConfirmDelete({ open: false, id: null, name: '' })}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <span className="warning-icon">⚠️</span>
                <p>Are you sure you want to delete the order <strong>"{confirmDelete.name}"</strong>?</p>
                <p className="warning-text">This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setConfirmDelete({ open: false, id: null, name: '' })}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
