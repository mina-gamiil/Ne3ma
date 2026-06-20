import React, { useState, useEffect, useRef } from 'react';
import './PartnerProfileTab.css';

export default function PartnerProfileTab() {
  const [profileData, setProfileData] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [editName, setEditName] = useState('');
  const [editSectionId, setEditSectionId] = useState('');
  
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        
        let sectionsData = [];
        const sectionsRes = await fetch("https://neama1.runasp.net/Api/MainSection", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (sectionsRes.ok) {
          sectionsData = await sectionsRes.json();
          setSections(sectionsData);
        }

        const profileRes = await fetch("https://neama1.runasp.net/Api/PartnerDashboard/info", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfileData(data);
          setEditName(data.name || '');
          setLogoPreview(data.logo_URL);
          setCoverPreview(data.cover_URL);
          
          if (data.mainSectionId) {
            setEditSectionId(data.mainSectionId);
          } else if (data.mainSectionName && sectionsData.length > 0) {
            const matchedSection = sectionsData.find(sec => sec.name === data.mainSectionName);
            if (matchedSection) setEditSectionId(matchedSection.id);
          }
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      setCoverPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editSectionId) {
      alert("يرجى اختيار القسم الرئيسي للبراند أولاً.");
      return;
    }

    setIsUpdating(true);

    try {
      const token = localStorage.getItem("userToken");
      
      const url = `https://neama1.runasp.net/Api/PartnerDashboard/partner?Name=${encodeURIComponent(editName)}&mainSectionId=${editSectionId}`;

      const formData = new FormData();
      if (logoFile) formData.append("Logo", logoFile);
      if (coverFile) formData.append("Cover", coverFile);

      const res = await fetch(url, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
        body: formData
      });

      if (res.ok) {
        alert("تم تحديث البيانات بنجاح! 🎉");
        
        const updatedRes = await fetch("https://neama1.runasp.net/Api/PartnerDashboard/info", { 
          headers: { "Authorization": `Bearer ${token}` } 
        });
        if (updatedRes.ok) {
          const newData = await updatedRes.json();
          setProfileData(newData);
          setEditName(newData.name || '');
          setLogoPreview(newData.logo_URL);
          setCoverPreview(newData.cover_URL);
          if (newData.mainSectionName) {
            const matchedSection = sections.find(sec => sec.name === newData.mainSectionName);
            if (matchedSection) setEditSectionId(matchedSection.id);
          }
        }
      } else {
        const errorText = await res.text();
        console.error("Server Error Response:", errorText);
        alert(`حدث خطأ أثناء التحديث. الرجاء المحاولة مرة أخرى.`);
      }
    } catch (err) {
      console.error(err);
      alert("خطأ في الاتصال بالخادم.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="loading-state-div">جاري تحميل البيانات... ⏳</div>;
  if (!profileData) return <div className="error-state-div">حدث خطأ أثناء جلب البيانات.</div>;

  return (
    <div className="partner-profile-wrapper">
      
      <div className="profile-header-row">
        <div>
          <h2 className="profile-main-title">👤 إعدادات البراند</h2>
          <p className="profile-subtitle">إدارة بيانات البراند، اللوجو، والغلاف الخاص بك</p>
        </div>
        <div className="wallet-badge-box">
          <span className="wallet-icon">💰</span>
          <div>
            <p className="wallet-title">رصيد المحفظة</p>
            <h3 className="wallet-amount">{profileData.walledBalance} ج.م</h3>
          </div>
        </div>
      </div>

      <div className="profile-card-container">
        
        <div className="cover-area-wrapper" onClick={() => coverInputRef.current.click()}>
          {coverPreview ? (
            <img src={coverPreview} alt="Cover" className="cover-img" />
          ) : (
            <div className="cover-gradient-fallback"></div>
          )}
          <div className="cover-overlay-hover">
            <span className="cover-change-text">📸 تغيير صورة الغلاف</span>
          </div>
          <input type="file" accept="image/*" hidden ref={coverInputRef} onChange={handleCoverChange} />
          
          <div className="logo-circle-wrapper" onClick={(e) => { e.stopPropagation(); logoInputRef.current.click(); }}>
            <div className="logo-inner-circle">
               {logoPreview ? (
                 <img src={logoPreview} alt="Logo" className="logo-img" />
               ) : (
                 <span className="logo-fallback-icon">🏪</span>
               )}
               <div className="logo-change-overlay">تغيير</div>
            </div>
            <input type="file" accept="image/*" hidden ref={logoInputRef} onChange={handleLogoChange} />
          </div>
        </div>

        <div className="profile-form-block">
          <form onSubmit={handleUpdate} className="profile-form-grid">
            
            <div className="form-group-full">
              <label className="form-label-profile">اسم البراند (قابل للتعديل):</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="form-input-text" />
            </div>
            
            <div className="form-group-full">
              <label className="form-label-profile">القسم الرئيسي للبراند:</label>
              <select 
                value={editSectionId} 
                onChange={(e) => setEditSectionId(e.target.value)} 
                required
                className="form-select-section"
              >
                <option value="" disabled>-- اختر القسم --</option>
                {sections.map(sec => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-full">
              <label className="form-label-profile" style={{color: '#334155'}}>البريد الإلكتروني:</label>
              <input type="email" value={profileData.managerEmail || ''} disabled className="form-input-disabled" />
            </div>

            <div className="form-group-full">
              <label className="form-label-profile" style={{color: '#334155'}}>تاريخ الإنشاء:</label>
              <input type="text" value={profileData.creationDate?.split('T')[0] || ''} disabled dir="ltr" className="form-input-disabled" />
            </div>

            <div className="submit-update-row">
              <button type="submit" disabled={isUpdating} className="submit-update-btn">
                {isUpdating ? 'جاري الحفظ... ⏳' : '💾 حفظ التعديلات'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}