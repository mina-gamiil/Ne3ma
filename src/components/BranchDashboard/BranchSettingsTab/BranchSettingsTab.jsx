import React, { useState, useEffect } from 'react';
import './BranchSettingsTab.css';

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

  if (loading) return <div className="branch-settings-loading">جاري تحميل إعدادات الفرع... ⏳</div>;
  
  if (errorMessage) return (
    <div className="branch-settings-error">
      <h3>حدث خطأ أثناء جلب بيانات الفرع.</h3>
      <p>السبب: {errorMessage}</p>
    </div>
  );

  return (
    <div className="branch-settings-wrapper">
      
      <div className="branch-settings-header-box">
        <h2 className="branch-settings-main-title">
          ⚙️ إعدادات الفرع
        </h2>
        <p className="branch-settings-subtitle">إدارة مواعيد العمل والتواصل الخاصة بهذا الفرع</p>
      </div>

      <div className="branch-media-cover-container">
        <img 
          src={branchData.cover_URL || 'https://via.placeholder.com/900x200?text=Cover+Image'} 
          alt="Branch Cover" 
          className="branch-cover-img"
        />
        <div className="branch-logo-img-wrapper">
          <img 
            src={branchData.logo_URL || 'https://via.placeholder.com/100?text=Logo'} 
            alt="Branch Logo" 
            className="branch-logo-img"
          />
        </div>
      </div>

      <div className="branch-settings-card">
        
        <div className="branch-settings-info-row">
          <div>
            <h3 className="branch-settings-name-heading">{branchData.branchName}</h3>
            <div className="branch-rating-map-group">
              <span className="branch-rating-badge">
                ⭐ {branchData.averageRating} ({branchData.reviewCount} تقييم)
              </span>
              {branchData.latitude && branchData.longitude && (
                <a 
                  href={`https://www.google.com/maps?q=${branchData.latitude},${branchData.longitude}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="branch-map-link-btn"
                >
                  📍 عرض على الخريطة
                </a>
              )}
            </div>
          </div>
          
          <div className="branch-status-badge-wrapper">
            <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px', fontWeight: 'bold' }}>حالة الفرع الحالية:</p>
            <span className="branch-status-badge-live">
              <span className="live-dot-indicator"></span>
              يستقبل طلبات الآن
            </span>
          </div>
        </div>

        <div className="branch-timing-grid">
          <div className="branch-timing-col">
            <label className="branch-timing-label">وقت الفتح:</label>
            <div className="branch-timing-display-box">
              <span>☀️</span>
              {branchData.openingTime}
            </div>
          </div>
          
          <div className="branch-timing-col">
            <label className="branch-timing-label">وقت الإغلاق:</label>
            <div className="branch-timing-display-box">
              <span>🌙</span>
              {branchData.closingTime}
            </div>
          </div>
        </div>

        <div className="branch-admin-notice-box">
          💡 <b>ملاحظة:</b> لتعديل أوقات العمل أو تحديث صورة الغلاف، يرجى التواصل مع الإدارة الرئيسية (الشريك).
        </div>

      </div>
    </div>
  );
}