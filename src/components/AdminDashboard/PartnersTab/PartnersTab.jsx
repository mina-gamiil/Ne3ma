import React, { useState, useEffect } from 'react';
import './PartnersTab.css';

export default function PartnersTab() {
  const [activeView, setActiveView] = useState('list');
  const [partnersList, setPartnersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    if (activeView === 'list') {
      const fetchPartners = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("userToken");
          let url = "https://neama1.runasp.net/Api/AdminDashboard/partners";
          if (search.trim() !== '') url += `?search=${encodeURIComponent(search)}`;
          const res = await fetch(url, { method: "GET", headers: { "Authorization": `Bearer ${token}`, "accept": "*/*" } });
          if (res.ok) setPartnersList(await res.json());
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
      };
      const delay = setTimeout(() => fetchPartners(), 500);
      return () => clearTimeout(delay);
    }
  }, [search, activeView]);

  const handleViewProfile = async (id) => {
    setActiveView('profile');
    setLoadingProfile(true);
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`https://neama1.runasp.net/Api/AdminDashboard/partner/${id}`, { 
          method: "GET", headers: { "Authorization": `Bearer ${token}`, "accept": "*/*" } 
      });
      if (res.ok) {
        setSelectedPartner(await res.json());
      } else { 
        alert("فشل في تحميل التفاصيل."); 
        setActiveView('list'); 
      }
    } catch (error) { 
      alert("تعذر الاتصال بالسيرفر."); 
      setActiveView('list'); 
    } finally { 
      setLoadingProfile(false); 
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (!window.confirm(currentStatus ? "هل أنت متأكد من إيقاف هذا الشريك؟ 🛑" : "هل تريد إعادة التنشيط؟ ✅")) return;
    const token = localStorage.getItem("userToken");
    
    const url = currentStatus 
      ? `https://neama1.runasp.net/Api/AdminDashboard/partner/${id}` 
      : `https://neama1.runasp.net/Api/AdminDashboard/ActivePartner/${id}`; 

    try {
      const res = await fetch(url, { 
          method: currentStatus ? "DELETE" : "POST", 
          headers: { "Authorization": `Bearer ${token}`, "accept": "*/*" } 
      });
      
      if (res.ok) {
        alert(currentStatus ? "تم الإيقاف بنجاح! 🛑" : "تم التنشيط بنجاح! ✅");
        if (selectedPartner && selectedPartner.id === id) {
            setSelectedPartner(prev => ({ ...prev, is_Active: !currentStatus }));
        }
        setPartnersList(prev => prev.map(p => p.id === id ? { ...p, is_Active: !currentStatus } : p));
      } else {
        alert("حدث خطأ في تحديث الحالة.");
      }
    } catch (error) { alert("تعذر الاتصال بالسيرفر."); }
  };

  const handleSettleAccount = async (id) => {
    if (!window.confirm("هل أنت متأكد من تصفير محفظة الشريك؟ 💸")) return;
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`https://neama1.runasp.net/Api/AdminDashboard/${id}/settle`, { 
          method: "PUT", headers: { "Authorization": `Bearer ${token}`, "accept": "*/*" } 
      });
      if (res.ok) {
        alert("تمت التصفية بنجاح! 💸");
        if (selectedPartner && selectedPartner.id === id) setSelectedPartner(prev => ({ ...prev, walledBalance: 0 }));
        setPartnersList(prev => prev.map(p => p.id === id ? { ...p, walledBalance: 0 } : p));
      } else alert("حدث خطأ أثناء التصفية.");
    } catch (error) { alert("تعذر الاتصال بالسيرفر."); }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (activeView === 'profile') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button onClick={() => setActiveView('list')} className="back-btn">🔙 العودة لقائمة الشركاء</button>
        
        {loadingProfile ? (
          <div className="partners-tab-container" style={{textAlign: 'center'}}><p>جاري تحميل ملف الشريك...</p></div>
        ) : selectedPartner ? (
          <>
            <div className="profile-card">
              <div className="profile-cover" style={{ backgroundImage: `url(${selectedPartner.cover_URL})` }}>
                 <div className="profile-logo-wrapper">
                    <img src={selectedPartner.logo_URL || 'https://via.placeholder.com/110'} alt="Logo" />
                 </div>
              </div>
              <div className="profile-info-header">
                 <div>
                   <h2 className="profile-name">{selectedPartner.name}</h2>
                   <p className="profile-meta">
                      <span className="category-badge">{selectedPartner.mainSectionName || 'بدون قسم'}</span>
                      📧 <span dir="ltr">{selectedPartner.managerEmail}</span>
                   </p>
                 </div>
                 <div className="action-buttons-group">
                   {selectedPartner.is_Active ? (
                     <span className="status-badge-active">حساب نشط 🟢</span>
                   ) : (
                     <span className="status-badge-inactive">حساب موقوف 🔴</span>
                   )}
                   <button 
                     className={selectedPartner.is_Active ? "deactivate-btn" : "activate-btn"}
                     onClick={() => handleToggleStatus(selectedPartner.id, selectedPartner.is_Active)}
                   >
                     {selectedPartner.is_Active ? 'إيقاف التعاقد 🛑' : 'إعادة تنشيط ✅'}
                   </button>
                 </div>
              </div>
            </div>

            <div className="stats-grid">
               <div className="stat-box teal">
                  <div className="stat-box-header">
                    <p className="stat-title">رصيد المحفظة</p>
                    {selectedPartner.walledBalance !== 0 && (
                      <button className="settle-btn" onClick={() => handleSettleAccount(selectedPartner.id)}>
                        تصفية الحساب 💸
                      </button>
                    )}
                  </div>
                  <h3 className="stat-value teal">{selectedPartner.walledBalance} <span style={{fontSize:'16px', color: '#94a3b8'}}>ج.م</span></h3>
               </div>

               <div className="stat-box blue">
                  <p className="stat-title">تاريخ الانضمام</p>
                  <h3 className="stat-value blue">{formatDate(selectedPartner.creationDate)}</h3>
               </div>
               
               <div className="stat-box orange">
                  <p className="stat-title">إجمالي الفروع</p>
                  <h3 className="stat-value orange">{selectedPartner.branches?.length || 0}</h3>
               </div>
            </div>

            <div className="partners-tab-container">
              <h3 className="branches-title">📍 الفروع المسجلة ({selectedPartner.branches?.length || 0})</h3>
              {selectedPartner.branches?.length > 0 ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>اسم الفرع</th>
                        <th>الموبايل</th>
                        <th>مواعيد العمل</th>
                        <th>التقييم</th>
                        <th>الحالة</th>
                        <th style={{ textAlign: 'center' }}>الموقع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPartner.branches.map(b => (
                        <tr key={b.id}>
                          <td><b>{b.branchName}</b></td>
                          <td dir="ltr" style={{ color: '#64748b' }}>{b.branchPhone}</td>
                          <td dir="ltr" style={{ textAlign: 'right' }}>
                            <span className="time-badge">{b.openingTime} - {b.closingTime}</span>
                          </td>
                          <td>
                            <span className="rating-star">⭐ {b.averageRating.toFixed(1)}</span>
                            <span className="rating-count">({b.reviewCount} تقييم)</span>
                          </td>
                          <td>
                            {b.is_Active ? <span className="branch-active">نشط 🟢</span> : <span className="branch-inactive">مغلق 🔴</span>}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {b.latitude && b.longitude ? (
                              <a href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`} target="_blank" rel="noopener noreferrer" className="location-btn">🗺️ الخريطة</a>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '12px' }}>غير متوفر</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p style={{textAlign: 'center', color: '#64748b', padding: '20px'}}>لا توجد فروع مسجلة لهذا الشريك حتى الآن.</p>}
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="partners-tab-container">
      <div className="partners-header-row">
        <h3 className="partners-main-title">🏪 قائمة الشركاء المسجلين</h3>
        <input type="text" placeholder="🔍 ابحث باسم الشريك..." value={search} onChange={(e) => setSearch(e.target.value)} className="partners-search-input" />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>جاري سحب بيانات الشركاء...</p>
      ) : partnersList.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '20px', fontWeight: 'bold' }}>لا يوجد شركاء مطابقين للبحث الحالي.</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>اللوجو</th>
                <th>اسم الشريك</th>
                <th>القسم</th>
                <th>البريد الإلكتروني</th>
                <th>الرصيد</th>
                <th>الحالة</th>
                <th style={{textAlign: 'center'}}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {partnersList.map((partner) => (
                <tr key={partner.id}>
                  <td style={{ textAlign: 'center' }}>
                    {partner.logo_URL ? <img src={partner.logo_URL} alt="logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} /> : '🏪'}
                  </td>
                  <td><b>{partner.name}</b></td>
                  <td>
                    <span className="category-badge" style={{marginLeft: 0, fontSize: '12px'}}>
                      {partner.mainSectionName || 'غير محدد'}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '13px' }} dir="ltr">{partner.managerEmail}</td>
                  <td><b style={{ color: '#0f766e' }}>{partner.walledBalance}</b> <span style={{fontSize: '10px'}}>ج.م</span></td>
                  <td>
                    {partner.is_Active ? <span style={{ color: '#166534', fontWeight: 'bold' }}>نشط 🟢</span> : <span style={{ color: '#991b1b', fontWeight: 'bold' }}>موقوف 🔴</span>}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="view-btn" onClick={() => handleViewProfile(partner.id)}>عرض 👁️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}