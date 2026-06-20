import React, { useState, useEffect } from 'react';
import './PartnerSidebar.css';

export default function PartnerSidebar({ activeTab, setActiveTab, onNavigate }) {
  const [partnerInfo, setPartnerInfo] = useState({ 
    name: 'جاري التحميل...', 
    managerEmail: '',
    logo_URL: null 
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch("https://neama1.runasp.net/Api/PartnerDashboard/info", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setPartnerInfo(data);
        } else {
          setPartnerInfo({ name: 'لوحة التحكم', managerEmail: 'partner@neama.com' });
        }
      } catch (err) {
        setPartnerInfo({ name: 'لوحة التحكم', managerEmail: 'partner@neama.com' });
      }
    };
    fetchPartnerInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    if (onNavigate) onNavigate('login');
    else window.location.href = '/'; 
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'statistics', label: 'الإحصائيات العامة', icon: '📊' },
    { id: 'branches', label: 'إدارة الفروع', icon: '📍' },
    { id: 'profile', label: 'البروفايل الشخصي', icon: '👤' }
  ];

  return (
    <>
      <button 
        className="mobile-menu-toggle-partner" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✖' : '☰'}
      </button>

      <div className={`partner-sidebar-container ${isMobileMenuOpen ? 'open' : ''}`}>
        
        <div className="partner-profile-header">
          <div className="partner-logo-wrapper">
            {partnerInfo.logo_URL ? (
              <img src={partnerInfo.logo_URL} alt="Logo" className="partner-logo-img" />
            ) : (
              partnerInfo.name ? partnerInfo.name.charAt(0).toUpperCase() : '🏪'
            )}
          </div>
          <h2 className="partner-name-heading">{partnerInfo.name}</h2>
          <p className="partner-email-p">{partnerInfo.managerEmail}</p>
        </div>

        <div className="partner-nav-list">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <div 
                key={item.id} 
                className={`partner-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(item.id)}
              >
                <span className="partner-nav-icon">{item.icon}</span>
                <span className="partner-nav-label">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="partner-sidebar-footer">
          <button className="partner-logout-btn" onClick={handleLogout}>
            <span>تسجيل الخروج</span>
            <span style={{ fontSize: '18px' }}>🚪</span>
          </button>
        </div>
        
      </div>
    </>
  );
}