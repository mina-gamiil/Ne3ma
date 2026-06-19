import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position ? <Marker position={position}></Marker> : null;
}

export default function PartnerBranchesTab() {
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [branchDetails, setBranchDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [timeFilter, setTimeFilter] = useState('0'); 
  
  const [newBranch, setNewBranch] = useState({
    branchName: '', branchPhone: '', email: '', password: '', openingTime: '09:00', closingTime: '23:00'
  });
  const [mapPosition, setMapPosition] = useState({ lat: 30.0444, lng: 31.2357 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAllBranches = async () => {
    setLoadingBranches(true);
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch(`https://neama1.runasp.net/Api/PartnerDashboard/branches`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setBranches(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    if (!selectedBranchId && !isAddingBranch) fetchAllBranches();
  }, [selectedBranchId, isAddingBranch]);

  useEffect(() => {
    if (!selectedBranchId) return;
    const fetchBranchDetails = async () => {
      setLoadingDetails(true);
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`https://neama1.runasp.net/Api/PartnerDashboard/branch/${selectedBranchId}?filter=${timeFilter}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setBranchDetails(await res.json());
      } catch (err) { 
        console.error(err); 
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchBranchDetails();
  }, [selectedBranchId, timeFilter]);

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("userToken");
      const opTime = newBranch.openingTime.length === 5 ? `${newBranch.openingTime}:00` : newBranch.openingTime;
      const clTime = newBranch.closingTime.length === 5 ? `${newBranch.closingTime}:00` : newBranch.closingTime;

      const formattedData = {
        branchName: newBranch.branchName, branchPhone: newBranch.branchPhone,
        email: newBranch.email, password: newBranch.password,
        openingTime: opTime, closingTime: clTime,
        latitude: mapPosition.lat, longitude: mapPosition.lng
      };

      const res = await fetch("https://neama1.runasp.net/Api/PartnerDashboard/branch", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(formattedData)
      });

      if (res.ok) {
        alert("تم إضافة الفرع بنجاح! 🎉");
        setIsAddingBranch(false); 
        fetchAllBranches(); 
        setNewBranch({ branchName: '', branchPhone: '', email: '', password: '', openingTime: '09:00', closingTime: '23:00' });
      } else {
        const errorText = await res.text();
        try {
          const errorJson = JSON.parse(errorText);
          alert(`خطأ: ${errorJson.message || 'بيانات غير صحيحة'}`);
        } catch {
          alert(`خطأ من الخادم: تأكد من الإيميل وقوة الباسورد`);
        }
      }
    } catch (err) {
      alert(`مشكلة في الاتصال: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (window.confirm("هل أنت متأكد من إيقاف/حذف هذا الفرع؟ لا يمكن التراجع عن هذه الخطوة.")) {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`https://neama1.runasp.net/Api/PartnerDashboard/branch/${branchId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          alert("تم إيقاف الفرع بنجاح!");
          handleBackToList();
          fetchAllBranches();
        } else {
          alert("حدث خطأ أثناء محاولة إيقاف الفرع. تأكد من الصلاحيات.");
        }
      } catch (err) {
        console.error(err);
        alert("خطأ في الاتصال بالخادم.");
      }
    }
  };

  const handleBackToList = () => {
    setSelectedBranchId(null);
    setIsAddingBranch(false);
    setBranchDetails(null);
    setTimeFilter('0');
  };

  if (isAddingBranch) {
    return (
      <div style={{ padding: '20px' }}>
        <button onClick={handleBackToList} style={{ background: '#f1f5f9', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', color: '#475569', fontWeight: 'bold', marginBottom: '20px' }}>
          → عودة للفروع
        </button>
        <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>🏪 إضافة فرع جديد</h2>
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <form onSubmit={handleCreateBranch} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>اسم الفرع:</label>
              <input type="text" required value={newBranch.branchName} onChange={e => setNewBranch({...newBranch, branchName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>رقم الهاتف:</label>
              <input type="text" required value={newBranch.branchPhone} onChange={e => setNewBranch({...newBranch, branchPhone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>موعد الفتح:</label>
              <input type="time" required value={newBranch.openingTime} onChange={e => setNewBranch({...newBranch, openingTime: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>موعد الإغلاق:</label>
              <input type="time" required value={newBranch.closingTime} onChange={e => setNewBranch({...newBranch, closingTime: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#0f766e' }}>👤 بيانات مدير الفرع</h4>
            </div>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>البريد الإلكتروني:</label>
              <input type="email" required value={newBranch.email} onChange={e => setNewBranch({...newBranch, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ gridColumn: 'span 1' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>كلمة المرور:</label>
              <input type="password" required value={newBranch.password} onChange={e => setNewBranch({...newBranch, password: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>📍 حدد موقع الفرع على الخريطة:</label>
              <div style={{ height: '300px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '2px solid #0f766e', position: 'relative', zIndex: 1 }}>
                <MapContainer center={[30.0444, 31.2357]} zoom={11} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker position={mapPosition} setPosition={setMapPosition} />
                </MapContainer>
              </div>
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '20px' }}>
              <button type="submit" disabled={isSubmitting} style={{ background: '#0f766e', color: 'white', border: 'none', padding: '12px 35px', borderRadius: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                {isSubmitting ? 'جاري الإضافة... ⏳' : '💾 حفظ وإضافة الفرع'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (selectedBranchId) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              onClick={handleBackToList}
              style={{ background: '#f1f5f9', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', color: '#475569', fontWeight: 'bold' }}
            >
              → عودة للفروع
            </button>
            <h2 style={{ color: '#1e293b', margin: 0 }}>
              {branchDetails?.branchName ? `تفاصيل: ${branchDetails.branchName}` : 'جاري التحميل...'}
            </h2>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {branchDetails && (
              <button 
                onClick={() => handleDeleteBranch(branchDetails.id)}
                style={{ padding: '10px 15px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', background: '#fee2e2', color: '#ef4444' }}
              >
                🔴 إيقاف الفرع
              </button>
            )}
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer', backgroundColor: 'white', color: '#1e293b', fontWeight: 'bold' }}
            >
              <option value="0">كل الوقت</option>
              <option value="1">اليوم</option>
              <option value="2">هذا الشهر</option>
              <option value="3">هذا العام</option>
            </select>
          </div>
        </div>

        {loadingDetails ? (
           <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>جاري تحميل تفاصيل الفرع... ⏳</div>
        ) : branchDetails ? (
          <>
            <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '25px', alignItems: 'center' }}>
              <div style={{ flex: '1 1 150px' }}>
                <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>حالة الفرع</p>
                <span style={{ padding: '6px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', background: branchDetails.is_Active ? '#ecfdf5' : '#fef2f2', color: branchDetails.is_Active ? '#065f46' : '#991b1b' }}>
                  {branchDetails.is_Active ? '🟢 نشط' : '🔴 غير نشط'}
                </span>
              </div>
              
              <div style={{ flex: '1 1 200px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px' }}>حساب مدير الفرع</p>
                <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px' }}>📧 {branchDetails.email || 'غير متوفر'}</h4>
              </div>
              
              <div style={{ flex: '1 1 150px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px' }}>مواعيد العمل</p>
                <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px' }}>🕒 {branchDetails.openingTime} - {branchDetails.closingTime}</h4>
              </div>
              
              <div style={{ flex: '1 1 150px' }}>
                <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '14px' }}>الهاتف</p>
                <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px' }}>📞 {branchDetails.branchPhone}</h4>
              </div>

              <div style={{ flex: '1 1 150px' }}>
                <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>الموقع الجغرافي</p>
                {branchDetails.latitude && branchDetails.longitude ? (
                  <a 
                    href={`https://maps.google.com/?q=${branchDetails.latitude},${branchDetails.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 15px', background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}
                  >
                    📍 عرض على الخريطة
                  </a>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>غير متوفر</span>
                )}
              </div>
            </div>

            <h3 style={{ color: '#1e293b', marginBottom: '20px' }}>📊 أداء الفرع</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {[
                { title: 'العناصر المباعة', value: branchDetails.soldItems || 0, color: '#0f766e', icon: '📦' },
                { title: 'مبيعات الفرع', value: `${branchDetails.branchSales || 0} ج.م`, color: '#15803d', icon: '💰' },
                { title: 'صافي الربح', value: `${branchDetails.branchNetProfit || 0} ج.م`, color: '#0369a1', icon: '📈' },
              ].map((item, index) => (
                <div key={index} style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderRight: `5px solid ${item.color}` }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{item.title}</p>
                  <h3 style={{ margin: '5px 0 0 0', color: '#1e293b', fontSize: '22px' }}>{item.value}</h3>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#1e293b', margin: '0 0 5px 0' }}>إدارة الفروع 📍</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>إضافة وتعديل فروع المنشأة وتعيين مديري الفروع</p>
        </div>
        <button 
          onClick={() => setIsAddingBranch(true)} 
          style={{ background: '#0f766e', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + إضافة فرع جديد
        </button>
      </div>

      {loadingBranches ? (
         <div style={{ textAlign: 'center', padding: '50px' }}>جاري تحميل الفروع... ⏳</div>
      ) : branches.length === 0 ? (
         <div style={{ textAlign: 'center', padding: '50px' }}>لا توجد فروع مضافة حتى الآن.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {branches.map((branch) => (
            <div key={branch.id} style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>🏪</div>
                <h3 style={{ margin: 0 }}>{branch.branchName}</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>📞 {branch.branchPhone}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button 
                  onClick={() => setSelectedBranchId(branch.id)}
                  style={{ width: '100%', padding: '10px', background: 'white', color: '#0ea5e9', border: '1px solid #0ea5e9', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}