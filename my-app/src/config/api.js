import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
})
// Orders
export const getOrders = () => api.get('/Orders/get');
export const addOrder = (order) => api.post('/Orders/add', order);
export const deleteOrder = (id) => api.delete(`/Orders/delete/${id}`);
export const updateOrder = (id, order) => api.put(`/Orders/update/${id}`, order);
export const markOrderComplete = (id) => api.put(`/Orders/complete/${id}`);
// Reservations
export const getReservations = () => api.get('/Reservations/get');
export const addReservation = (reservation) => api.post('/Reservations/add', reservation);
export const deleteReservation = (id) => api.delete(`/Reservations/delete/${id}`);
export const updateReservation = (id, reservation) => api.put(`/Reservations/update/${id}`, reservation);
// Tables
export const getTables = () => api.get('/Tables/get');
export const addTable = (table) => api.post('/Tables/add', table);
export const deleteTable = (id) => api.delete(`/Tables/delete/${id}`);
export const updateTable = (id, table) => api.put(`/Tables/update/${id}`, table);
// Inventory
export const getInventory = () => api.get('/Inventory/get');
export const addInventoryItem = (item) => api.post('/Inventory/add', item);
export const updateInventoryItem = (id, item) => api.put(`/Inventory/update/${id}`, item);
export const deleteInventoryItem = (id) => api.delete(`/Inventory/delete/${id}`);