import React, { useState } from 'react';

import BranchSidebar from './BranchSidebar';

import BranchOrdersTab from './BranchOrdersTab';
import BranchItemsTab from './BranchItemsTab';
import BranchStatisticsTab from './BranchStatisticsTab';
import BranchSettingsTab from './BranchSettingsTab'; 

export default function BranchDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('statistics');

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':     return <BranchOrdersTab />;
      case 'menu':       return <BranchItemsTab />;
      case 'statistics': return <BranchStatisticsTab />;
      case 'settings':   return <BranchSettingsTab />;
      default:           return <BranchStatisticsTab />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', direction: 'rtl', background: '#f8fafc', margin: 0, padding: 0, overflow: 'hidden' }}>
      
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
      
      <div style={{ flex: 1, height: '100vh', overflow: 'hidden' }}>
        {renderContent()}
      </div>
      
    </div>
  );
}