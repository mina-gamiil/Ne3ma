import React, { useState } from 'react';
import './BranchSidebar.css';

export default function BranchSidebar({ activeTab, setActiveTab, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'statistics', icon: '📊', label: 'إحصائيات الفرع' },
    { id: 'orders', icon: '🛒', label: 'إدارة الطلبات' },
    { id: 'menu', icon: '📦', label: 'قائمة المنتجات (المنيو)' },
    { id: 'settings', icon: '⚙️', label: 'إعدادات الفرع' }
  ];

  return (
    <>
      <button className="branch-mobile-toggle" onClick={() => setIsOpen(true)}>
        ☰
      </button>

      {isOpen && <div className="branch-sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      <div className={`branch-sidebar-container ${isOpen ? 'open' : ''}`}>
        <button className="branch-mobile-close" onClick={() => setIsOpen(false)}>
          ×
        </button>

        <div className="branch-sidebar-header">
          <div className="branch-sidebar-avatar">🏪</div>
          <h2 className="branch-sidebar-title">لوحة تحكم الفرع</h2>
          <p className="branch-sidebar-subtitle">مدير الفرع</p>
        </div>

        <div className="branch-nav-list">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`branch-nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <span className="branch-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="branch-footer-wrapper">
          <button
            onClick={() => onNavigate('login')}
            className="branch-logout-btn"
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </div>
    </>
  );
}