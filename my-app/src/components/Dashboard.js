import React from 'react';
import '../Styles/Dashboard.css';

const cardData = [
  {
    title: 'Add Order',
    description: 'Create a new order for a customer.',
    icon: '🧾',
    onAdd: () => alert('Add Order'),
    addButton: true,
    row: 1,
  },
  {
    title: 'Reservations',
    description: 'View all reservations.',
    icon: '📅',
    addButton: false,
    row: 2,
  },
  {
    title: 'Occupied Tables',
    description: 'View currently occupied tables.',
    icon: '🍽️',
    addButton: false,
    row: 2,
  },
  {
    title: 'Alerts',
    description: 'See important alerts and notifications.',
    icon: '⚠️',
    addButton: false,
    alertsCard: true,
    row: 3,
  },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Restaurant Dashboard</h1>
      {/* Row 1: Orders */}
      <div className="dashboard-cards">
        {cardData.filter(card => card.row === 1).map((card) => (
          <div className={`dashboard-card improved${!card.addButton ? ' view-only' : ''}`} key={card.title}>
            <div className="dashboard-card-icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
            {card.addButton && (
              <button className="dashboard-add-btn" onClick={card.onAdd}>
                + Add
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Row 2: Reservations and Occupied Tables */}
      <div className="dashboard-cards">
        {cardData.filter(card => card.row === 2).map((card) => (
          <div className={`dashboard-card improved view-only`} key={card.title}>
            <div className="dashboard-card-icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
      {/* Row 3: Alerts */}
      <div className="dashboard-cards">
        {cardData.filter(card => card.row === 3).map((card) => (
          <div className={`dashboard-card improved alerts-card`} key={card.title}>
            <div className="dashboard-card-icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
