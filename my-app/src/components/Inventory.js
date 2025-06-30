import React, { useEffect, useState } from 'react';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../config/api';
import '../Styles/Inventory.css';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [itemData, setItemData] = useState({ name: '', description: '', price: '', quantity: '', category: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    setLoading(true);
    getInventory()
      .then(res => setInventory(res.data))
      .catch(() => setError('Failed to fetch inventory'))
      .finally(() => setLoading(false));
  };

  const openModal = (id = null, data = { name: '', description: '', price: '', quantity: '', category: '', image: null }) => {
    setEditId(id);
    setItemData({
      name: data.name || '',
      description: data.description || '',
      price: data.price || '',
      quantity: data.quantity || '',
      category: data.category || '',
      image: null
    });
    setImagePreview(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditId(null);
    setItemData({ name: '', description: '', price: '', quantity: '', category: '', image: null });
    setImagePreview(null);
    setModalOpen(false);
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setItemData(prev => ({ ...prev, image: files[0] }));
      setImagePreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setItemData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!itemData.name || !itemData.description || !itemData.price || !itemData.category) return setError('All required fields must be filled');
    setLoading(true);
    let formData = new FormData();
    formData.append('name', itemData.name);
    formData.append('description', itemData.description);
    formData.append('price', itemData.price);
    formData.append('quantity', itemData.quantity);
    formData.append('category', itemData.category);
    if (itemData.image) formData.append('image', itemData.image);
    const action = editId
      ? updateInventoryItem(editId, formData)
      : addInventoryItem(formData);
    action
      .then(() => {
        closeModal();
        fetchInventory();
      })
      .catch(() => setError('Failed to save item'))
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoading(true);
    deleteInventoryItem(confirmDelete.id)
      .then(() => {
        setConfirmDelete({ open: false, id: null });
        fetchInventory();
      })
      .catch(() => setError('Failed to delete item'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="inventory-container">
      <h1>Inventory</h1>
      <button className="dashboard-add-btn" onClick={() => openModal()}>+ Add Item</button>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && inventory.length === 0 && <div className="empty-state">No inventory items found.</div>}
      <ul className="inventory-list">
        {inventory.map(item => (
          <li key={item._id} className="inventory-item">
            <span><b>{item.name}</b> | {item.category} | ${item.price} | Qty: {item.quantity} <br />{item.description}</span>
            <button onClick={() => openModal(item._id, item)}>Edit</button>
            <button onClick={() => setConfirmDelete({ open: true, id: item._id })}>Delete</button>
          </li>
        ))}
      </ul>
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editId ? 'Edit Item' : 'Add Item'}</h2>
            <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="modal-form" encType="multipart/form-data">
              <label>Name*
                <input
                  name="name"
                  value={itemData.name}
                  onChange={handleChange}
                  placeholder="Item name"
                  required
                />
              </label>
              <label>Description*
                <textarea
                  name="description"
                  value={itemData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  required
                />
              </label>
              <label>Price*
                <input
                  name="price"
                  type="number"
                  value={itemData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                />
              </label>
              <label>Quantity
                <input
                  name="quantity"
                  type="number"
                  value={itemData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                />
              </label>
              <label>Category*
                <input
                  name="category"
                  value={itemData.category}
                  onChange={handleChange}
                  placeholder="Category"
                  required
                />
              </label>
              <label>Image
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: 80, marginTop: 8 }} />}
              </label>
              <div className="modal-actions">
                <button type="submit" className="dashboard-add-btn">
                  {editId ? 'Save' : 'Add'}
                </button>
                <button type="button" onClick={closeModal} className="dashboard-add-btn" style={{ background: '#fff', color: '#e63946' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Delete */}
      {confirmDelete.open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this item?</p>
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

export default Inventory;
