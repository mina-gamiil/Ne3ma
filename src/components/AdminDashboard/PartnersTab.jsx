import React, { useState, useEffect } from 'react';

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

  const styles = {
    container: { backgroundColor: 'white', borderRadius: '12px', padding: '25px', overflowX: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'right' },
    th: { padding: '14px', backgroundColor: '#f1f5f9', fontWeight: '700', borderBottom: '2px solid #e2e8f0', color: '#475569' },
    td: { padding: '14px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#334155', verticalAlign: 'middle' },
    viewBtn: { backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' },
    deactivateBtn: { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    activateBtn: { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #4ade80', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    settleBtn: { backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
    locationBtn: { display: 'inline-block', backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' },
    backBtn: { alignSelf: 'flex-start', background: 'white', border: '1px solid #cbd5e1', color: '#475569', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' },
    searchInput: { width: '300px', padding: '10px 15px', borderRadius: '30px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#f1f5f9' }
  };

  
  if (activeView === 'profile') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button onClick={() => setActiveView('list')} style={styles.backBtn}>🔙 العودة لقائمة الشركاء</button>
        
        {loadingProfile ? (
          <div style={{...styles.container, textAlign: 'center'}}><p>جاري تحميل ملف الشريك...</p></div>
        ) : selectedPartner ? (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
              <div style={{ height: '220px', backgroundColor: '#e2e8f0', backgroundImage: `url(${selectedPartner.cover_URL})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                 <div style={{ position: 'absolute', bottom: '-40px', right: '40px', width: '110px', height: '110px', borderRadius: '50%', backgroundColor: 'white', padding: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <img src={selectedPartner.logo_URL || 'https://via.placeholder.com/110'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="Logo" />
                 </div>
              </div>
              <div style={{ padding: '50px 40px 30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                 <div>
                   <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1e293b', marginBottom: '5px' }}>{selectedPartner.name}</h2>
                   <p style={{ color: '#64748b', fontSize: '15px' }}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', marginLeft: '10px' }}>{selectedPartner.mainSectionName || 'بدون قسم'}</span>
                      📧 <span dir="ltr">{selectedPartner.managerEmail}</span>
                   </p>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   {selectedPartner.is_Active ? (
                     <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '15px' }}>حساب نشط 🟢</span>
                   ) : (
                     <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '15px' }}>حساب موقوف 🔴</span>
                   )}
                   <button 
                     style={{ ...(selectedPartner.is_Active ? styles.deactivateBtn : styles.activateBtn), position: 'relative', zIndex: 10 }}
                     onClick={() => handleToggleStatus(selectedPartner.id, selectedPartner.is_Active)}
                   >
                     {selectedPartner.is_Active ? 'إيقاف التعاقد 🛑' : 'إعادة تنشيط ✅'}
                   </button>
                 </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
               <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', borderRight: '5px solid #0f766e', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>رصيد المحفظة</p>
                    {selectedPartner.walledBalance !== 0 && (
                      <button style={{...styles.settleBtn, position: 'relative', zIndex: 10}} onClick={() => handleSettleAccount(selectedPartner.id)}>
                        تصفية الحساب 💸
                      </button>
                    )}
                  </div>
                  <h3 style={{ fontSize: '30px', color: '#0f766e', fontWeight: '900', marginTop: '10px' }}>{selectedPartner.walledBalance} <span style={{fontSize:'16px', color: '#94a3b8'}}>ج.م</span></h3>
               </div>

               <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', borderRight: '5px solid #3b82f6', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 'bold' }}>تاريخ الانضمام</p>
                  <h3 style={{ fontSize: '22px', color: '#3b82f6', fontWeight: '900', marginTop: '10px' }}>{formatDate(selectedPartner.creationDate)}</h3>
               </div>
               
               <div style={{ flex: 1, minWidth: '200px', backgroundColor: 'white', padding: '25px', borderRadius: '12px', borderRight: '5px solid #f59e0b', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 'bold' }}>إجمالي الفروع</p>
                  <h3 style={{ fontSize: '30px', color: '#f59e0b', fontWeight: '900', marginTop: '5px' }}>{selectedPartner.branches?.length || 0}</h3>
               </div>
            </div>

            <div style={styles.container}>
              <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '20px', color: '#1e293b' }}>📍 الفروع المسجلة ({selectedPartner.branches?.length || 0})</h3>
              {selectedPartner.branches?.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>اسم الفرع</th>
                      <th style={styles.th}>الموبايل</th>
                      <th style={styles.th}>مواعيد العمل</th>
                      <th style={styles.th}>التقييم</th>
                      <th style={styles.th}>الحالة</th>
                      <th style={styles.th} style={{ textAlign: 'center' }}>الموقع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPartner.branches.map(b => (
                      <tr key={b.id}>
                        <td style={styles.td}><b>{b.branchName}</b></td>
                        <td style={styles.td} dir="ltr" style={{ color: '#64748b' }}>{b.branchPhone}</td>
                        <td style={styles.td} dir="ltr" style={{ textAlign: 'right' }}>
                          <span style={{backgroundColor: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '13px'}}>{b.openingTime} - {b.closingTime}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '14px' }}>⭐ {b.averageRating.toFixed(1)}</span>
                          <span style={{ color: '#94a3b8', fontSize: '12px', marginRight: '5px' }}>({b.reviewCount} تقييم)</span>
                        </td>
                        <td style={styles.td}>
                          {b.is_Active ? <span style={{ color: '#166534', fontWeight: 'bold', fontSize: '12px' }}>نشط 🟢</span> : <span style={{ color: '#991b1b', fontWeight: 'bold', fontSize: '12px' }}>مغلق 🔴</span>}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          {b.latitude && b.longitude ? (
                            <a href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`} target="_blank" rel="noopener noreferrer" style={{...styles.locationBtn, position: 'relative', zIndex: 10}}>🗺️ الخريطة</a>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '12px' }}>غير متوفر</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p style={{textAlign: 'center', color: '#64748b', padding: '20px'}}>لا توجد فروع مسجلة لهذا الشريك حتى الآن.</p>}
            </div>
          </>
        ) : null}
      </div>
    );
  }

  

  
  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>🏪 قائمة الشركاء المسجلين</h3>
        <input type="text" placeholder="🔍 ابحث باسم الشريك..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.searchInput} />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>جاري سحب بيانات الشركاء...</p>
      ) : partnersList.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '20px', fontWeight: 'bold' }}>لا يوجد شركاء مطابقين للبحث الحالي.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '60px', textAlign: 'center' }}>اللوجو</th>
              <th style={styles.th}>اسم الشريك</th>
              <th style={styles.th}>القسم</th>
              <th style={styles.th}>البريد الإلكتروني</th>
              <th style={styles.th}>الرصيد</th>
              <th style={styles.th}>الحالة</th>
              <th style={styles.th} style={{textAlign: 'center'}}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {partnersList.map((partner) => (
              <tr key={partner.id}>
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  {partner.logo_URL ? <img src={partner.logo_URL} alt="logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} /> : '🏪'}
                </td>
                <td style={styles.td}><b>{partner.name}</b></td>
                <td style={styles.td}>
                  <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                    {partner.mainSectionName || 'غير محدد'}
                  </span>
                </td>
                <td style={{ ...styles.td, color: '#64748b', fontSize: '13px' }} dir="ltr">{partner.managerEmail}</td>
                <td style={styles.td}><b style={{ color: '#0f766e' }}>{partner.walledBalance}</b> <span style={{fontSize: '10px'}}>ج.م</span></td>
                <td style={styles.td}>
                  {partner.is_Active ? <span style={{ color: '#166534', fontWeight: 'bold' }}>نشط 🟢</span> : <span style={{ color: '#991b1b', fontWeight: 'bold' }}>موقوف 🔴</span>}
                </td>
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  <button style={styles.viewBtn} onClick={() => handleViewProfile(partner.id)}>عرض 👁️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}