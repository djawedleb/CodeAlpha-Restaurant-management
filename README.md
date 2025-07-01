# Restaurant Management System

A full-stack web application for managing restaurant operations, including orders, reservations, tables, and food inventory. Built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## Features

- **Dashboard**: Overview of orders, reservations, tables, and low-stock inventory alerts.
- **Order Management**: Create, confirm, and delete orders. Confirming an order automatically decreases inventory quantities.
- **Reservation Management**: Add, edit, and delete table reservations. Reservations are validated for conflicts.
- **Table Management**: Add, edit, and delete tables with capacity.
- **Inventory Management**: Add, edit, and delete food items. Low-stock alerts for items with quantity < 2.
- **Modern UI/UX**: Responsive, restaurant-themed design with Material icons and color palette.

---

## Project Structure

```
Restaurant-management/
  my-app/         # React frontend
  Server/         # Node.js/Express backend
```

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud, e.g., MongoDB Atlas)

### 1. Backend Setup (Server)

```
cd Server
npm install
```

Create a `.env` file in `Server/` with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend:
```
npm start
```

The backend will run on `http://localhost:5000` by default.

### 2. Frontend Setup (my-app)

```
cd my-app
npm install
npm start
```

The frontend will run on `http://localhost:3000` by default.

---

## API Overview

### Orders
- `GET    /api/Orders/get`         - List all orders
- `POST   /api/Orders/add`         - Add a new order
- `PUT    /api/Orders/update/:id`  - Update an order
- `DELETE /api/Orders/delete/:id`  - Delete an order
- `PUT    /api/Orders/complete/:id`- Confirm (complete) an order (decreases inventory)

### Inventory
- `GET    /api/Inventory/get`         - List all food items
- `POST   /api/Inventory/add`         - Add a new food item
- `PUT    /api/Inventory/update/:id`  - Update a food item
- `DELETE /api/Inventory/delete/:id`  - Delete a food item

### Reservations
- `GET    /api/Reservations/get`         - List all reservations
- `POST   /api/Reservations/add`         - Add a new reservation
- `PUT    /api/Reservations/update/:id`  - Update a reservation
- `DELETE /api/Reservations/delete/:id`  - Delete a reservation

### Tables
- `GET    /api/Tables/get`         - List all tables
- `POST   /api/Tables/add`         - Add a new table
- `PUT    /api/Tables/update/:id`  - Update a table
- `DELETE /api/Tables/delete/:id`  - Delete a table

---

## Customization & Branding
- **Favicon**: Place your restaurant icon as `my-app/public/favicon.ico`.
- **App Name**: Edit `my-app/public/manifest.json` and `index.html` for your restaurant name and theme color.
- **Theme**: Update colors in `my-app/src/Styles/` for a custom look.

---

## Development Notes
- Confirming an order will decrease the quantity of each food item in the order by 1.
- Reservations and tables are validated to prevent double-booking.
- All main features are accessible from the sidebar and dashboard.

---

## License
MIT
