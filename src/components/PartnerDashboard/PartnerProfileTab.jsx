import React, { useState, useEffect, useRef } from 'react';

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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#0f766e', fontWeight: 'bold' }}>جاري تحميل البيانات... ⏳</div>;
  if (!profileData) return <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>حدث خطأ أثناء جلب البيانات.</div>;

  return (
    <div style={{ padding: '20px' }}>
      
      <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>👤 إعدادات البراند</h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>إدارة بيانات البراند، اللوجو، والغلاف الخاص بك</p>
        </div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>💰</span>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#166534', fontWeight: 'bold' }}>رصيد المحفظة</p>
            <h3 style={{ margin: 0, color: '#15803d' }}>{profileData.walledBalance} ج.م</h3>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        
        <div style={{ position: 'relative', height: '220px', background: '#cbd5e1', cursor: 'pointer', overflow: 'hidden' }} onClick={() => coverInputRef.current.click()}>
          {coverPreview ? (
            <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #0f766e, #06b6d4)' }}></div>
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0}>
            <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '8px' }}>📸 تغيير صورة الغلاف</span>
          </div>
          <input type="file" accept="image/*" hidden ref={coverInputRef} onChange={handleCoverChange} />
          
          <div style={{ position: 'absolute', bottom: '-40px', right: '40px', width: '110px', height: '110px', borderRadius: '50%', background: 'white', padding: '5px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 10 }} onClick={(e) => { e.stopPropagation(); logoInputRef.current.click(); }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
               {logoPreview ? (
                 <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               ) : (
                 <span style={{ fontSize: '40px' }}>🏪</span>
               )}
               <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '12px', textAlign: 'center', padding: '4px 0' }}>تغيير</div>
            </div>
            <input type="file" accept="image/*" hidden ref={logoInputRef} onChange={handleLogoChange} />
          </div>
        </div>

        <div style={{ padding: '60px 40px 40px 40px' }}>
          <form onSubmit={handleUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0f766e' }}>اسم البراند (قابل للتعديل):</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #0f766e', boxSizing: 'border-box', fontWeight: 'bold' }} />
            </div>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0f766e' }}>القسم الرئيسي للبراند:</label>
              <select 
                value={editSectionId} 
                onChange={(e) => setEditSectionId(e.target.value)} 
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #0f766e', boxSizing: 'border-box', background: '#ffffff', cursor: 'pointer', fontWeight: 'bold', color: '#334155' }}
              >
                <option value="" disabled>-- اختر القسم --</option>
                {sections.map(sec => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>البريد الإلكتروني:</label>
              <input type="email" value={profileData.managerEmail || ''} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#94a3b8', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>تاريخ الإنشاء:</label>
              <input type="text" value={profileData.creationDate?.split('T')[0] || ''} disabled dir="ltr" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#94a3b8', boxSizing: 'border-box' }} />
            </div>

            <div style={{ gridColumn: 'span 2', marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={isUpdating} style={{ background: isUpdating ? '#94a3b8' : '#0f766e', color: 'white', border: 'none', padding: '12px 35px', borderRadius: '10px', cursor: isUpdating ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(15, 118, 110, 0.3)', transition: '0.3s' }}>
                {isUpdating ? 'جاري الحفظ... ⏳' : '💾 حفظ التعديلات'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}