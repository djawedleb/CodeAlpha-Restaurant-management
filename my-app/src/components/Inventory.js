import React, { useEffect, useState } from 'react';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../config/api';
import '../Styles/Inventory.css';
import { MdEdit, MdDelete } from 'react-icons/md';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getInventory();
      setInventory(res.data);
    } catch (err) {
      console.error('Error fetching food items:', err);
      if (err.response) {
        setError(`Failed to fetch food items: ${err.response.status} - ${err.response.data || err.response.statusText}`);
      } else if (err.request) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('Failed to fetch food items: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditId(item._id);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        quantity: item.quantity || '',
        category: item.category || ''
      });
    } else {
      setEditId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: ''
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
      description: '',
      price: '',
      quantity: '',
      category: ''
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
      setError('Food name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return false;
    }
    if (formData.quantity && formData.quantity < 0) {
      setError('Quantity cannot be negative');
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
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
        category: formData.category.trim()
      };

      if (editId) {
        await updateInventoryItem(editId, itemData);
        setSuccess('Item updated successfully!');
      } else {
        await addInventoryItem(itemData);
        setSuccess('Item added successfully!');
      }

      setTimeout(() => {
        closeModal();
        fetchInventory();
      }, 1000);
    } catch (err) {
      console.error('Error saving food item:', err);
      if (err.response) {
        setError(`Failed to ${editId ? 'update' : 'add'} food item: ${err.response.data || err.response.statusText}`);
      } else if (err.request) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError(`Failed to ${editId ? 'update' : 'add'} food item: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteInventoryItem(confirmDelete.id);
      setConfirmDelete({ open: false, id: null, name: '' });
      fetchInventory();
    } catch (err) {
      setError('Failed to delete food item');
      console.error('Error deleting food item:', err);
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

  const getCategoryColor = (category) => {
    const colors = {
      'Food': '#4caf50',
      'Beverage': '#2196f3',
      'Dessert': '#ff9800',
      'Appetizer': '#9c27b0',
      'Main Course': '#f44336',
      'Side Dish': '#795548'
    };
    return colors[category] || '#6c757d';
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h1>Food Management</h1>
        <button className="add-inventory-btn" onClick={() => openModal()}>
          <span className="btn-icon">+</span>
          Add New Food Item
        </button>
      </div>

      {loading && !modalOpen && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading food items...</p>
        </div>
      )}

      {error && !modalOpen && (
        <div className="error-message">
          <span className="error-icon">⚠</span>
          {error}
        </div>
      )}

      {!loading && inventory.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No Food Items Found</h3>
          <p>Start by adding your first food item</p>
          <button className="add-inventory-btn" onClick={() => openModal()}>
            Add First Food Item
          </button>
        </div>
      )}

      {!loading && inventory.length > 0 && (
        <div className="inventory-grid">
          {inventory.map(item => (
            <div key={item._id} className="inventory-card">
              <div className="inventory-content">
                <div className="inventory-header-card">
                  <h3 className="item-name">{item.name}</h3>
                  <span className="item-price">{formatPrice(item.price)}</span>
                  <div className="category-badge" style={{ backgroundColor: getCategoryColor(item.category) }}>
                    {item.category}
                  </div>
                </div>
                
                <p className="item-description">{item.description}</p>
                
                <div className="inventory-details">
                  <div className="inventory-info">
                    <span className="info-label">Quantity:</span>
                    <span className={`info-value ${item.quantity <= 5 ? 'low-stock' : ''}`}>
                      {item.quantity || 0} units
                    </span>
                  </div>
                  <div className="inventory-info">
                    <span className="info-label">Added:</span>
                    <span className="info-value">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
                
                <div className="inventory-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => openModal(item)}
                    title="Edit Item"
                  >
                    <MdEdit size={18} style={{ marginRight: 4 }} /> Edit
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => setConfirmDelete({ open: true, id: item._id, name: item.name })}
                    title="Delete Item"
                  >
                    <MdDelete size={18} style={{ marginRight: 4 }} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Modal for Add/Edit */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? 'Edit Food Item' : 'Add New Food Item'}</h2>
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
                <label htmlFor="name">Food Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter food name"
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter food description"
                  className="form-input"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price *</label>
                  <div className="price-input-wrapper">
                    <span className="currency-symbol">$</span>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="form-input price-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select a category</option>
                  <option value="Food">Food</option>
                  <option value="Beverage">Beverage</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Side Dish">Side Dish</option>
                </select>
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
                  editId ? 'Update Food Item' : 'Add Food Item'
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
                <p>Are you sure you want to delete the food item <strong>"{confirmDelete.name}"</strong>?</p>
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
                  'Delete Food Item'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
