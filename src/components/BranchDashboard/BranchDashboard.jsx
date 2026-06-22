import React, { useState } from 'react';
import BranchSidebar from './BranchSidebar/BranchSidebar';
import BranchSettingsTab from './BranchSettingsTab/BranchSettingsTab';
import BranchStatisticsTab from './BranchStatisticsTab/BranchStatisticsTab';
import MenuTab from './MenuTab/MenuTab';
import OrdersTab from './OrdersTab/OrdersTab';
import './BranchDashboard.css';

export default function BranchDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('statistics');

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':     return <OrdersTab />;
      case 'menu':       return <MenuTab />;
      case 'statistics': return <BranchStatisticsTab />;
      case 'settings':   return <BranchSettingsTab />;
      default:           return <BranchStatisticsTab />;
    }
  };

  return (
    <div className="branch-dashboard-wrapper">
      <BranchSidebar activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} />
      
      <div className="branch-main-area">
        {renderContent()}
      </div>
    </div>
  );
}