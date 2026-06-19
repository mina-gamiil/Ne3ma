import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StatisticsTab from './StatisticsTab';
import RequestsTab from './RequestsTab';
import AddPartnerTab from './AddPartnerTab';
import PartnersTab from './PartnersTab';
import UsersTab from './UsersTab';
import CategoriesTab from './CategoriesTab';
import DeliveryMethodsTab from './DeliveryMethodsTab';
import CharitiesTab from './CharitiesTab';

function AdminDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('statistics');

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }} dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} />
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
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