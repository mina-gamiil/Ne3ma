import React, { useState, useEffect } from 'react';

export default function BranchSettingsTab() {
  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchBranchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");
        
        if (!token) {
          setErrorMessage("لم يتم العثور على التوكن. الرجاء تسجيل الدخول مجدداً.");
          setLoading(false);
          return;
        }

        const res = await fetch(`https://neama1.runasp.net/Api/BranchDashboard/info`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setBranchData(data);
        } else {
          setErrorMessage(`السيرفر رفض الطلب أو لم يجد بيانات. كود الخطأ: ${res.status}`);
        }
      } catch (err) {
        console.error("Error fetching branch settings", err);
        setErrorMessage(`مشكلة في الاتصال بالشبكة أو السيرفر: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBranchProfile();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>جاري تحميل إعدادات الفرع... ⏳</div>;
  
  if (errorMessage) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444', background: '#fef2f2', borderRadius: '10px', margin: '20px' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>حدث خطأ أثناء جلب بيانات الفرع.</h3>
      <p style={{ margin: 0, fontWeight: 'bold' }}>السبب: {errorMessage}</p>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1e293b', margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ⚙️ إعدادات الفرع
        </h2>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>إدارة مواعيد العمل والتواصل الخاصة بهذا الفرع</p>
      </div>

      <div style={{ position: 'relative', marginBottom: '60px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <img 
          src={branchData.cover_URL || 'https://via.placeholder.com/900x200?text=Cover+Image'} 
          alt="Branch Cover" 
          style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', bottom: '-40px', right: '30px', width: '100px', height: '100px', borderRadius: '50%', border: '4px solid white', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <img 
            src={branchData.logo_URL || 'https://via.placeholder.com/100?text=Logo'} 
            alt="Branch Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '22px' }}>{branchData.branchName}</h3>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fef9c3', color: '#a16207', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                ⭐ {branchData.averageRating} ({branchData.reviewCount} تقييم)
              </span>
              {branchData.latitude && branchData.longitude && (
                <a 
                  href={`https://www.google.com/maps?q=${branchData.latitude},${branchData.longitude}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#0284c7', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}
                >
                  📍 عرض على الخريطة
                </a>
              )}
            </div>
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>حالة الفرع الحالية:</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', color: '#059669', padding: '8px 15px', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold' }}>
              <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
              يستقبل طلبات الآن
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', margin: '0 0 8px 0', color: '#1e293b', fontWeight: 'bold', fontSize: '14px' }}>وقت الفتح:</label>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 15px', color: '#475569', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>☀️</span>
              {branchData.openingTime}
            </div>
          </div>
          
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', margin: '0 0 8px 0', color: '#1e293b', fontWeight: 'bold', fontSize: '14px' }}>وقت الإغلاق:</label>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 15px', color: '#475569', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🌙</span>
              {branchData.closingTime}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', background: '#f0f9ff', borderRight: '4px solid #0ea5e9', borderRadius: '8px', color: '#0369a1', fontSize: '13px' }}>
          💡 <b>ملاحظة:</b> لتعديل أوقات العمل أو تحديث صورة الغلاف، يرجى التواصل مع الإدارة الرئيسية (الشريك).
        </div>

      </div>
    </div>
  );
}