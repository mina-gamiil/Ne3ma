import React, { useState, useEffect } from 'react';

export default function PartnerSidebar({ activeTab, setActiveTab, onNavigate }) {
  const [partnerInfo, setPartnerInfo] = useState({ 
    name: 'جاري التحميل...', 
    managerEmail: '',
    logo_URL: null 
  });

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

  const navItems = [
    { id: 'statistics', label: 'الإحصائيات العامة', icon: '📊' },
    { id: 'branches', label: 'إدارة الفروع', icon: '📍' },
    { id: 'profile', label: 'البروفايل الشخصي', icon: '👤' }
  ];

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800&display=swap');
          .partner-scroll::-webkit-scrollbar { width: 5px; }
          .partner-scroll::-webkit-scrollbar-track { background: transparent; }
          .partner-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
          .partner-nav-item { transition: all 0.3s ease; }
          .partner-nav-item:hover { background: rgba(255, 255, 255, 0.08); transform: translateX(-4px); }
          .partner-logout:hover { background: #dc2626 !important; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4); }
        `}
      </style>

      <div style={{
        width: '270px', background: '#0f766e', color: '#ffffff',
        display: 'flex', flexDirection: 'column', height: '100%',
        boxShadow: '-2px 0 15px rgba(0,0,0,0.1)', fontFamily: "'Tajawal', sans-serif", zIndex: 100
      }}>
        
        <div style={{ padding: '30px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', marginBottom: '10px' }}>
          <div style={{
            width: '70px', height: '70px', background: '#ffffff', color: '#0f766e', 
            borderRadius: '50%', margin: '0 auto 12px', display: 'flex', justifyContent: 'center', alignItems: 'center', 
            fontSize: '30px', fontWeight: '800', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', overflow: 'hidden'
          }}>
            {partnerInfo.logo_URL ? (
              <img src={partnerInfo.logo_URL} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              partnerInfo.name ? partnerInfo.name.charAt(0).toUpperCase() : '🏪'
            )}
          </div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800' }}>{partnerInfo.name}</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#ccfbf1', fontWeight: '400' }}>{partnerInfo.managerEmail}</p>
        </div>

        <div className="partner-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px 15px' }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <div 
                key={item.id} 
                className={isActive ? "" : "partner-nav-item"}
                style={{
                  display: 'flex', alignItems: 'center', padding: '12px 15px', margin: '6px 0', 
                  borderRadius: '10px', cursor: 'pointer', 
                  background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  borderRight: isActive ? '4px solid #ffffff' : '4px solid transparent',
                  fontWeight: isActive ? '800' : '700', color: isActive ? '#ffffff' : 'rgba(255,255,255,0.85)',
                }}
                onClick={() => setActiveTab(item.id)}
              >
                <span style={{ marginLeft: '12px', fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '15px' }}>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '20px' }}>
          <button className="partner-logout" style={{ width: '100%', background: '#ef4444', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} onClick={handleLogout}>
            <span>تسجيل الخروج</span><span style={{ fontSize: '18px' }}>🚪</span>
          </button>
        </div>
      </div>
    </>
  );
}