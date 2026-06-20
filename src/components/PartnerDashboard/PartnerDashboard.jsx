import React, { useState } from 'react';
import PartnerSidebar from './PartnerSidebar/PartnerSidebar';
import PartnerStatisticsTab from './PartnerStatisticsTab/PartnerStatisticsTab';
import PartnerBranchesTab from './PartnerBranchesTab/PartnerBranchesTab';
import PartnerProfileTab from './PartnerProfileTab/PartnerProfileTab';
import './PartnerDashboard.css';

export default function PartnerDashboard({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('statistics');
  const [sidebarLogo, setSidebarLogo] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'statistics': return <PartnerStatisticsTab />;
      case 'branches':   return <PartnerBranchesTab />;
      case 'profile':    return <PartnerProfileTab />;
      default:             return <PartnerStatisticsTab />;
    }
  };

  return (
    <div className="partner-dashboard-wrapper">
      <PartnerSidebar activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} />
      
      <div className="partner-main-content">
        {renderContent()}
      </div>
    </div>
  );
}