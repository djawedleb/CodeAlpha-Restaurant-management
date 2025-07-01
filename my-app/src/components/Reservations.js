import React, { useEffect, useState } from 'react';
import { getReservations, addReservation, deleteReservation, updateReservation, getTables } from '../config/api';
import '../Styles/Reservations.css';
import { MdEventSeat, MdPerson, MdTableBar, MdAccessTime, MdDateRange, MdCheckCircle, MdEdit, MdDelete } from 'react-icons/md';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    table: '',
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getReservations();
      setReservations(res.data);
    } catch (err) {
      setError('Failed to fetch reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
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

  const openModal = (reservation = null) => {
    fetchTables();
    if (reservation) {
      setEditId(reservation._id);
      setFormData({
        name: reservation.name || '',
        table: reservation.table || '',
        date: reservation.date ? new Date(reservation.date).toISOString().split('T')[0] : '',
        time: reservation.time || ''
      });
    } else {
      setEditId(null);
      setFormData({
        name: '',
        table: '',
        date: '',
        time: ''
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
      date: '',
      time: ''
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
    if (!formData.table || formData.table <= 0) {
      setError('Table number must be greater than 0');
      return false;
    }
    if (!formData.date) {
      setError('Date is required');
      return false;
    }
    if (!formData.time) {
      setError('Time is required');
      return false;
    }
    
    // Check if date is not in the past
    const selectedDate = new Date(formData.date + 'T' + formData.time);
    const now = new Date();
    if (selectedDate < now) {
      setError('Reservation date and time cannot be in the past');
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
      const reservationData = {
        name: formData.name.trim() || 'Anonymous',
        table: parseInt(formData.table),
        date: new Date(formData.date + 'T' + formData.time),
        time: formData.time
      };

      if (editId) {
        await updateReservation(editId, reservationData);
        setSuccess('Reservation updated successfully!');
      } else {
        await addReservation(reservationData);
        setSuccess('Reservation added successfully!');
      }

      setTimeout(() => {
        closeModal();
        fetchReservations();
      }, 1000);
    } catch (err) {
      setError(editId ? 'Failed to update reservation' : 'Failed to add reservation');
      console.error('Error saving reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteReservation(confirmDelete.id);
      setConfirmDelete({ open: false, id: null, name: '' });
      fetchReservations();
    } catch (err) {
      setError('Failed to delete reservation');
      console.error('Error deleting reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (dateString) => {
    const reservationDate = new Date(dateString);
    const now = new Date();
    const diffTime = reservationDate - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      return '#6c757d'; // Past
    } else if (diffDays < 1) {
      return '#dc3545'; // Today
    } else if (diffDays < 7) {
      return '#ffc107'; // This week
    } else {
      return '#28a745'; // Future
    }
  };

  const getStatusText = (dateString) => {
    const reservationDate = new Date(dateString);
    const now = new Date();
    const diffTime = reservationDate - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      return 'Past';
    } else if (diffDays < 1) {
      return 'Today';
    } else if (diffDays < 7) {
      return 'This Week';
    } else {
      return 'Upcoming';
    }
  };

  // Generate time options for the time select
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  return (
    <div className="reservations-container">
      <div className="section-card">
        <div className="section-header">
          <MdEventSeat size={26} className="section-icon" />
          <h1>Reservations Management</h1>
        </div>
        <button className="add-reservation-btn" onClick={() => openModal()}>
          <MdEventSeat size={20} style={{ marginRight: 6 }} /> Add New Reservation
        </button>
        {loading && !modalOpen && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading reservations...</p>
          </div>
        )}
        {error && !modalOpen && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        {!loading && reservations.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><MdEventSeat size={40} /></div>
            <h3>No Reservations Found</h3>
            <p>Start by adding your first reservation</p>
            <button className="add-reservation-btn" onClick={() => openModal()}>
              <MdEventSeat size={20} style={{ marginRight: 6 }} /> Add First Reservation
            </button>
          </div>
        )}
        {!loading && reservations.length > 0 && (
          <div className="reservations-grid">
            {reservations.map(reservation => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-header-card">
                  <span className="reservation-name">
                    <MdPerson style={{ marginRight: 4, color: '#ff7043' }} />
                    {reservation.name || 'Anonymous'}
                  </span>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(reservation.date) }}>
                    {getStatusText(reservation.date)}
                  </span>
                </div>
                <div className="reservation-details">
                  <div className="reservation-info">
                    <MdTableBar style={{ marginRight: 4, color: '#43a047' }} />
                    <span className="info-label">Table:</span>
                    <span className="info-value table-number">#{reservation.table}</span>
                  </div>
                  <div className="reservation-info">
                    <MdDateRange style={{ marginRight: 4, color: '#1976d2' }} />
                    <span className="info-label">Date:</span>
                    <span className="info-value">{formatDate(reservation.date)}</span>
                  </div>
                  <div className="reservation-info">
                    <MdAccessTime style={{ marginRight: 4, color: '#ff7043' }} />
                    <span className="info-label">Time:</span>
                    <span className="info-value">{formatTime(reservation.time)}</span>
                  </div>
                  <div className="reservation-info">
                    <span className="info-label">Created:</span>
                    <span className="info-value">{formatDateTime(reservation.createdAt)}</span>
                  </div>
                </div>
                <div className="reservation-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => openModal(reservation)}
                    title="Edit Reservation"
                  >
                    <MdEdit size={18} style={{ marginRight: 4 }} /> Edit
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => setConfirmDelete({ open: true, id: reservation._id, name: reservation.name })}
                    title="Delete Reservation"
                  >
                    <MdDelete size={18} style={{ marginRight: 4 }} /> Delete
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
                <h2>{editId ? 'Edit Reservation' : 'Add New Reservation'}</h2>
                <button className="close-btn" onClick={closeModal}>×</button>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
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
                  <label htmlFor="name">Customer Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter customer name (optional)"
                    className="form-input"
                    autoFocus
                  />
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
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date *</label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time *</label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select time</option>
                      {generateTimeOptions().map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
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
                    editId ? 'Update Reservation' : 'Add Reservation'
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
                  <p>Are you sure you want to delete the reservation for <strong>"{confirmDelete.name}"</strong>?</p>
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
                    'Delete Reservation'
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

export default Reservations;
