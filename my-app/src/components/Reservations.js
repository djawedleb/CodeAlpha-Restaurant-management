import React, { useEffect, useState } from 'react';
import { getReservations, addReservation, deleteReservation, updateReservation } from '../config/api';
import '../Styles/Reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [reservationName, setReservationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    setLoading(true);
    getReservations()
      .then(res => setReservations(res.data))
      .catch(() => setError('Failed to fetch reservations'))
      .finally(() => setLoading(false));
  };

  const openModal = (id = null, name = '') => {
    setEditId(id);
    setReservationName(name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditId(null);
    setReservationName('');
    setModalOpen(false);
  };

  const handleSave = () => {
    setLoading(true);
    const action = editId
      ? updateReservation(editId, { name: reservationName })
      : addReservation({ name: reservationName });
    action
      .then(() => {
        closeModal();
        fetchReservations();
      })
      .catch(() => setError('Failed to save reservation'))
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoading(true);
    deleteReservation(confirmDelete.id)
      .then(() => {
        setConfirmDelete({ open: false, id: null });
        fetchReservations();
      })
      .catch(() => setError('Failed to delete reservation'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="reservations-container">
      <h1>Reservations</h1>
      <button className="dashboard-add-btn" onClick={() => openModal()}>+ Add Reservation</button>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && reservations.length === 0 && <div className="empty-state">No reservations found.</div>}
      <ul className="reservation-list">
        {reservations.map(reservation => (
          <li key={reservation._id} className="reservation-item">
            {reservation.name}
            <button onClick={() => openModal(reservation._id, reservation.name)}>Edit</button>
            <button onClick={() => setConfirmDelete({ open: true, id: reservation._id })}>Delete</button>
          </li>
        ))}
      </ul>
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editId ? 'Edit Reservation' : 'Add Reservation'}</h2>
            <input
              value={reservationName}
              onChange={e => setReservationName(e.target.value)}
              placeholder="Reservation name"
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
            <p>Are you sure you want to delete this reservation?</p>
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

export default Reservations;
