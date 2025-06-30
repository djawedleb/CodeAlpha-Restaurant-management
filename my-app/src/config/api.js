import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})
// Orders
export const getOrders = () => api.get('/Orders/get');
export const addOrder = (order) => api.post('/Orders/add', order);
export const deleteOrder = (id) => api.delete(`/Orders/delete/${id}`);
export const updateOrder = (id, order) => api.put(`/Orders/update/${id}`, order);
// Reservations
export const getReservations = () => api.get('/Reservations');
export const addReservation = (reservation) => api.post('/Reservations/add', reservation);
export const deleteReservation = (id) => api.delete(`/Reservations/delete/${id}`);
export const updateReservation = (id, reservation) => api.put(`/Reservations/update/${id}`, reservation);
// Tables
export const getTables = () => api.get('/tables/get');
export const addTable = (table) => api.post('/tables/add', table);
export const deleteTable = (id) => api.delete(`/tables/delete/${id}`);
export const updateTable = (id, table) => api.put(`/tables/update/${id}`, table);
// Inventory
export const getInventory = () => api.get('/inventory/get');
export const addInventoryItem = (item) => api.post('/inventory/add', item);
export const updateInventoryItem = (id, item) => api.put(`/inventory/update/${id}`, item);
export const deleteInventoryItem = (id) => api.delete(`/inventory/delete/${id}`);