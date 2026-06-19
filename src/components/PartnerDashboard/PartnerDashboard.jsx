import React, { useState } from 'react';
import PartnerSidebar from './PartnerSidebar';
import PartnerStatisticsTab from './PartnerStatisticsTab';
import PartnerBranchesTab from './PartnerBranchesTab';
import PartnerProfileTab from './PartnerProfileTab';

export default function PartnerDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('statistics');
  const [sidebarLogo, setSidebarLogo] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics': return <PartnerStatisticsTab />;
      case 'branches':   return <PartnerBranchesTab />;
      case 'profile':    return <PartnerProfileTab />;
      default:           return <PartnerStatisticsTab />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f8fafc', overflow: 'hidden', direction: 'rtl' }}>
      
      
      <PartnerSidebar activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} />
      
    
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderContent()}
      </div>
      
    </div>
  );
}