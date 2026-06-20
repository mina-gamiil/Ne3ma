import React, { useState, useEffect } from 'react';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab, pendingCount, onNavigate }) {
  const [adminInfo, setAdminInfo] = useState({ displayName: 'جاري التحميل...', email: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch("https://neama1.runasp.net/Api/Profile/info", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAdminInfo(data);
        } else {
          setAdminInfo({ displayName: 'الأدمن', email: 'admin@neama.com' });
        }
      } catch (err) {
        setAdminInfo({ displayName: 'الأدمن', email: 'admin@neama.com' });
      }
    };
    fetchAdminInfo();
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
    { id: 'statistics', label: 'الإحصائيات', icon: '📊' },
    { id: 'requests', label: 'طلبات الانضمام', icon: '📄', badge: pendingCount },
    { id: 'add_partner', label: 'إضافة شريك', icon: '➕' },
    { id: 'partners', label: 'الشركاء المسجلين', icon: '🏪' },
    { id: 'charities', label: 'الجمعيات', icon: '🤝' },
    { id: 'users', label: 'المستخدمين', icon: '👥' },
    { id: 'categories', label: 'الأقسام', icon: '🏷️' },
    { id: 'delivery_methods', label: 'طرق التوصيل', icon: '🚚' }
  ];

  const getInitial = (name) => {
    return name && name !== 'جاري التحميل...' ? name.charAt(0).toUpperCase() : '👨‍💻';
  };

  return (
    <>
      <button 
        className="mobile-menu-toggle" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✖' : '☰'} 
      </button>

      <div className={`admin-sidebar-container ${isMobileMenuOpen ? 'open' : ''}`}>
        
        <div className="sidebar-profile-header">
          <div className="profile-avatar">
            {getInitial(adminInfo.displayName)}
          </div>
          <h2 className="profile-name">{adminInfo.displayName}</h2>
          <p className="profile-email">{adminInfo.email}</p>
        </div>

        <div className="sidebar-nav-list">
          {navItems.map(item => (
            <div 
              key={item.id} 
              className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span>تسجيل الخروج</span>
            <span style={{ fontSize: '18px' }}>🚪</span>
          </button>
        </div>
        
      </div>
    </>
  );
}