import React, { useEffect, useState } from 'react';
import { getTables, addTable, deleteTable, updateTable } from '../config/api';
import '../Styles/Tables.css';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tableData, setTableData] = useState({ number: '', person: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = () => {
    setLoading(true);
    getTables()
      .then(res => setTables(res.data))
      .catch(() => setError('Failed to fetch tables'))
      .finally(() => setLoading(false));
  };

  const openModal = (id = null, data = { number: '', person: '' }) => {
    setEditId(id);
    setTableData({
      number: data.number || '',
      person: data.person || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditId(null);
    setTableData({ number: '', person: '' });
    setModalOpen(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setTableData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!tableData.number || !tableData.person) return setError('All fields are required');
    setLoading(true);
    const payload = {
      number: Number(tableData.number),
      person: Number(tableData.person)
    };
    const action = editId
      ? updateTable(editId, payload)
      : addTable(payload);
    action
      .then(() => {
        closeModal();
        fetchTables();
      })
      .catch(() => setError('Failed to save table'))
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoading(true);
    deleteTable(confirmDelete.id)
      .then(() => {
        setConfirmDelete({ open: false, id: null });
        fetchTables();
      })
      .catch(() => setError('Failed to delete table'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="tables-container">
      <h1>Tables</h1>
      <button className="dashboard-add-btn" onClick={() => openModal()}>+ Add Table</button>
      {loading && <div className="spinner">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && tables.length === 0 && <div className="empty-state">No tables found.</div>}
      <ul className="table-list">
        {tables.map(table => (
          <li key={table._id} className="table-item">
            <span>Table #{table.number} | Persons: {table.person}</span>
            <button onClick={() => openModal(table._id, table)}>Edit</button>
            <button onClick={() => setConfirmDelete({ open: true, id: table._id })}>Delete</button>
          </li>
        ))}
      </ul>
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>{editId ? 'Edit Table' : 'Add Table'}</h2>
            <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="modal-form">
              <label>Table Number
                <input
                  name="number"
                  type="number"
                  value={tableData.number}
                  onChange={handleChange}
                  placeholder="Table number"
                  required
                />
              </label>
              <label>Persons
                <input
                  name="person"
                  type="number"
                  value={tableData.person}
                  onChange={handleChange}
                  placeholder="Number of persons"
                  required
                />
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
            <p>Are you sure you want to delete this table?</p>
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

export default Tables;
