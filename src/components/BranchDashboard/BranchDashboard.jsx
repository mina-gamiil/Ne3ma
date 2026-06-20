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
      <style>{`
        html, body, #root { 
          overflow: hidden !important; 
          height: 100vh !important; 
        }
        .hide-scroll::-webkit-scrollbar { 
          display: none !important; 
        }
        .hide-scroll { 
          -ms-overflow-style: none !important; 
          scrollbar-width: none !important; 
        }
        *::-webkit-scrollbar { 
          display: none !important; 
          width: 0px !important; 
          height: 0px !important; 
        }
      `}</style>

      <BranchSidebar activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} />
      
      <div className="branch-main-area">
        {renderContent()}
      </div>
      
    </div>
  );
}