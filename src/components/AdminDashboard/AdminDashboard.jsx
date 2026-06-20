import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import StatisticsTab from './StatisticsTab/StatisticsTab';
import RequestsTab from './RequestsTab/RequestsTab';
import AddPartnerTab from './AddPartnerTab/AddPartnerTab';
import PartnersTab from './PartnersTab/PartnersTab';
import UsersTab from './UsersTab/UsersTab';
import CategoriesTab from './CategoriesTab/CategoriesTab';
import DeliveryMethodsTab from './DeliveryMethodsTab/DeliveryMethodsTab';
import CharitiesTab from './CharitiesTab/CharitiesTab';
import './AdminDashboard.css';

function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('statistics');

  return (
    <div className="admin-dashboard-wrapper">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} />
      
      <div className="admin-main-content">
        {activeTab === 'statistics' && <StatisticsTab />}
        {activeTab === 'requests' && <RequestsTab />}
        {activeTab === 'add_partner' && <AddPartnerTab />}
        {activeTab === 'partners' && <PartnersTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'categories' && <CategoriesTab />}
        {activeTab === 'delivery_methods' && <DeliveryMethodsTab />}
        {activeTab === 'charities' && <CharitiesTab />}
      </div>
    </div>
  );
}

export default AdminDashboard;