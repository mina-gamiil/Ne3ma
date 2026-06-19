import React from 'react';

export default function BranchSidebar({ activeTab, setActiveTab, onNavigate }) {
  const menuItems = [
    { id: 'statistics', icon: '📊', label: 'إحصائيات الفرع' },
    { id: 'orders', icon: '🛒', label: 'إدارة الطلبات' },
    { id: 'menu', icon: '📦', label: 'قائمة المنتجات (المنيو)' },
    { id: 'settings', icon: '⚙️', label: 'إعدادات الفرع' }
  ];

  return (
    <div style={{ width: '260px', background: '#0f766e', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px 0', boxShadow: '-4px 0 15px rgba(0,0,0,0.1)', zIndex: 10 }}>
      <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏪</div>
        <h2 style={{ margin: 0, fontSize: '20px' }}>لوحة تحكم الفرع</h2>
        <p style={{ margin: '5px 0 0 0', color: '#ccfbf1', fontSize: '13px' }}>مدير الفرع</p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 15px' }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', 
              background: activeTab === item.id ? 'rgba(255,255,255,0.15)' : 'transparent', 
              border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', 
              fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', textAlign: 'right', width: '100%'
            }}
          >
            <span style={{ fontSize: '22px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 15px', marginTop: '20px' }}>
        <button
          onClick={() => onNavigate('login')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', 
            padding: '15px', background: '#ef4444', color: 'white', border: 'none', 
            borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s'
          }}
        >
          🚪 تسجيل الخروج
        </button>
      </div>
    </div>
  );
}