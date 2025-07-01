import React, { useEffect, useState } from 'react';
import { getTables, addTable, deleteTable, updateTable } from '../config/api';
import '../Styles/Tables.css';
import { MdTableBar, MdEventSeat, MdEdit, MdDelete } from 'react-icons/md';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    person: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, number: '' });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTables();
      setTables(res.data);
    } catch (err) {
      setError('Failed to fetch tables');
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (table = null) => {
    if (table) {
      setEditId(table._id);
      setFormData({
        number: table.number || '',
        person: table.person || ''
      });
    } else {
      setEditId(null);
      setFormData({
        number: '',
        person: ''
      });
    }
    setModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setEditId(null);
    setFormData({
      number: '',
      person: ''
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
    if (!formData.number || formData.number <= 0) {
      setError('Table number must be greater than 0');
      return false;
    }
    if (!formData.person || formData.person <= 0) {
      setError('Number of persons must be greater than 0');
      return false;
    }
    
    // Check if table number already exists (for new tables)
    if (!editId) {
      const tableExists = tables.some(table => table.number === parseInt(formData.number));
      if (tableExists) {
        setError('Table number already exists');
        return false;
      }
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tableData = {
        number: parseInt(formData.number),
        person: parseInt(formData.person)
      };

      if (editId) {
        await updateTable(editId, tableData);
        setSuccess('Table updated successfully!');
      } else {
        await addTable(tableData);
        setSuccess('Table added successfully!');
      }

      setTimeout(() => {
        closeModal();
        fetchTables();
      }, 1000);
    } catch (err) {
      setError(editId ? 'Failed to update table' : 'Failed to add table');
      console.error('Error saving table:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteTable(confirmDelete.id);
      setConfirmDelete({ open: false, id: null, number: '' });
      fetchTables();
    } catch (err) {
      setError('Failed to delete table');
      console.error('Error deleting table:', err);
    } finally {
      setLoading(false);
    }
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

  const getCapacityColor = (capacity) => {
    if (capacity <= 2) return '#4caf50'; // Small table
    if (capacity <= 4) return '#ff9800'; // Medium table
    if (capacity <= 6) return '#2196f3'; // Large table
    return '#9c27b0'; // Extra large table
  };

  const getCapacityText = (capacity) => {
    if (capacity <= 2) return 'Small';
    if (capacity <= 4) return 'Medium';
    if (capacity <= 6) return 'Large';
    return 'Extra Large';
  };

  return (
    <div className="tables-container">
      <div className="section-card">
        <div className="section-header">
          <MdTableBar size={26} className="section-icon" />
          <h1>Tables Management</h1>
        </div>
        <button className="add-table-btn" onClick={() => openModal()}>
          <MdTableBar size={20} style={{ marginRight: 6 }} /> Add New Table
        </button>
        {loading && !modalOpen && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading tables...</p>
          </div>
        )}
        {error && !modalOpen && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        {!loading && tables.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><MdTableBar size={40} /></div>
            <h3>No Tables Found</h3>
            <p>Start by adding your first table</p>
            <button className="add-table-btn" onClick={() => openModal()}>
              <MdTableBar size={20} style={{ marginRight: 6 }} /> Add First Table
            </button>
          </div>
        )}
        {!loading && tables.length > 0 && (
          <div className="tables-grid">
            {tables.map(table => (
              <div key={table._id} className="table-card">
                <div className="table-header-card">
                  <span className="table-number-badge">
                    <MdEventSeat style={{ marginRight: 4, color: '#ff7043' }} />
                    Table #{table.number}
                  </span>
                  <span className="capacity-badge" style={{ marginLeft: 12 }}>
                    Capacity: {table.person}
                  </span>
                </div>
                <div className="table-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => openModal(table)}
                    title="Edit Table"
                  >
                    <MdEdit style={{ marginRight: 4 }} /> Edit
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => setConfirmDelete({ open: true, id: table._id, number: table.number })}
                    title="Delete Table"
                  >
                    <MdDelete style={{ marginRight: 4 }} /> Delete
                  </button>
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
                <h2>{editId ? 'Edit Table' : 'Add New Table'}</h2>
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
                  <label htmlFor="number">Table Number *</label>
                  <input
                    id="number"
                    name="number"
                    type="number"
                    min="1"
                    value={formData.number}
                    onChange={handleInputChange}
                    placeholder="Enter table number"
                    className="form-input"
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="person">Capacity (Number of Persons) *</label>
                  <select
                    id="person"
                    name="person"
                    value={formData.person}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select capacity</option>
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3">3 people</option>
                    <option value="4">4 people</option>
                    <option value="5">5 people</option>
                    <option value="6">6 people</option>
                    <option value="8">8 people</option>
                    <option value="10">10 people</option>
                    <option value="12">12 people</option>
                  </select>
                </div>

                {formData.person && (
                  <div className="capacity-preview">
                    <div className="preview-header">
                      <span className="preview-label">Table Preview:</span>
                      <span 
                        className="preview-badge" 
                        style={{ backgroundColor: getCapacityColor(formData.person) }}
                      >
                        {getCapacityText(formData.person)}
                      </span>
                    </div>
                    <div className="table-visual">
                      <div className="table-shape">
                        <span className="table-icon">🪑</span>
                        <span className="capacity-text">{formData.person}</span>
                      </div>
                    </div>
                  </div>
                )}
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
                    editId ? 'Update Table' : 'Add Table'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Confirm Delete Modal */}
        {confirmDelete.open && (
          <div className="modal-backdrop" onClick={() => setConfirmDelete({ open: false, id: null, number: '' })}>
            <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Confirm Delete</h2>
                <button 
                  className="close-btn" 
                  onClick={() => setConfirmDelete({ open: false, id: null, number: '' })}
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="delete-warning">
                  <span className="warning-icon">⚠️</span>
                  <p>Are you sure you want to delete <strong>Table #{confirmDelete.number}</strong>?</p>
                  <p className="warning-text">This action cannot be undone.</p>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setConfirmDelete({ open: false, id: null, number: '' })}
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
                    'Delete Table'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;
