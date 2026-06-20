import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './PartnerBranchesTab.css';

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
      <div className="branches-tab-wrapper">
        <button onClick={handleBackToList} className="back-to-branches-btn">
          → عودة للفروع
        </button>
        <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>🏪 إضافة فرع جديد</h2>
        <div className="branch-form-container">
          <form onSubmit={handleCreateBranch} className="branch-form-grid">
            <div className="form-group-branch">
              <label className="form-label-branch">اسم الفرع:</label>
              <input type="text" required value={newBranch.branchName} onChange={e => setNewBranch({...newBranch, branchName: e.target.value})} className="form-input-branch" />
            </div>
            
            <div className="form-group-branch">
              <label className="form-label-branch">رقم الهاتف:</label>
              <input type="text" required value={newBranch.branchPhone} onChange={e => setNewBranch({...newBranch, branchPhone: e.target.value})} className="form-input-branch" />
            </div>
            
            <div className="form-group-branch">
              <label className="form-label-branch">موعد الفتح:</label>
              <input type="time" required value={newBranch.openingTime} onChange={e => setNewBranch({...newBranch, openingTime: e.target.value})} className="form-input-branch" />
            </div>
            
            <div className="form-group-branch">
              <label className="form-label-branch">موعد الإغلاق:</label>
              <input type="time" required value={newBranch.closingTime} onChange={e => setNewBranch({...newBranch, closingTime: e.target.value})} className="form-input-branch" />
            </div>
            
            <div className="form-group-full" style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <h4 className="section-divider-title">👤 بيانات مدير الفرع</h4>
            </div>
            
            <div className="form-group-branch">
              <label className="form-label-branch">البريد الإلكتروني:</label>
              <input type="email" required value={newBranch.email} onChange={e => setNewBranch({...newBranch, email: e.target.value})} className="form-input-branch" />
            </div>
            
            <div className="form-group-branch">
              <label className="form-label-branch">كلمة المرور:</label>
              <input type="password" required value={newBranch.password} onChange={e => setNewBranch({...newBranch, password: e.target.value})} className="form-input-branch" />
            </div>
            
            <div className="form-group-full" style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <label className="form-label-branch">📍 حدد موقع الفرع على الخريطة:</label>
              <div className="map-wrapper">
                <MapContainer center={[30.0444, 31.2357]} zoom={11} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker position={mapPosition} setPosition={setMapPosition} />
                </MapContainer>
              </div>
            </div>
            
            <div className="form-group-full" style={{ marginTop: '20px' }}>
              <button type="submit" disabled={isSubmitting} className="submit-branch-btn">
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
      <div className="branches-tab-wrapper">
        <div className="branch-details-header">
          <div className="branch-details-title-wrapper">
            <button 
              onClick={handleBackToList}
              className="back-to-branches-btn"
              style={{marginBottom: 0}}
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
                className="suspend-branch-btn"
              >
                🔴 إيقاف الفرع
              </button>
            )}
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="time-filter-select"
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
            <div className="info-card-wrapper">
              <div className="info-item-block">
                <p>حالة الفرع</p>
                <span className={`status-badge-branch ${branchDetails.is_Active ? 'active' : 'inactive'}`}>
                  {branchDetails.is_Active ? '🟢 نشط' : '🔴 غير نشط'}
                </span>
              </div>
              
              <div className="info-item-block">
                <p>حساب مدير الفرع</p>
                <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px', overflowWrap: 'break-word' }}>📧 {branchDetails.email || 'غير متوفر'}</h4>
              </div>
              
              <div className="info-item-block">
                <p>مواعيد العمل</p>
                <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px' }}>🕒 {branchDetails.openingTime} - {branchDetails.closingTime}</h4>
              </div>
              
              <div className="info-item-block">
                <p>الهاتف</p>
                <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px' }}>📞 {branchDetails.branchPhone}</h4>
              </div>

              <div className="info-item-block">
                <p>الموقع الجغرافي</p>
                {branchDetails.latitude && branchDetails.longitude ? (
                  <a 
                    href={`https://maps.google.com/?q=${branchDetails.latitude},${branchDetails.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link-btn"
                  >
                    📍 عرض على الخريطة
                  </a>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>غير متوفر</span>
                )}
              </div>
            </div>

            <h3 style={{ color: '#1e293b', marginBottom: '20px' }}>📊 أداء الفرع</h3>
            <div className="performance-grid">
              {[
                { title: 'العناصر المباعة', value: branchDetails.soldItems || 0, color: 'teal', icon: '📦' },
                { title: 'مبيعات الفرع', value: `${branchDetails.branchSales || 0} ج.م`, color: 'green', icon: '💰' },
                { title: 'صافي الربح', value: `${branchDetails.branchNetProfit || 0} ج.م`, color: 'blue', icon: '📈' },
              ].map((item, index) => (
                <div key={index} className={`perf-card ${item.color}`}>
                  <div className="perf-icon">{item.icon}</div>
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
    <div className="branches-tab-wrapper">
      <div className="branches-header">
        <div>
          <h2 className="branches-main-title">إدارة الفروع 📍</h2>
          <p className="branches-subtitle">إضافة وتعديل فروع المنشأة وتعيين مديري الفروع</p>
        </div>
        <button 
          onClick={() => setIsAddingBranch(true)} 
          className="add-branch-main-btn"
        >
          + إضافة فرع جديد
        </button>
      </div>

      {loadingBranches ? (
         <div style={{ textAlign: 'center', padding: '50px' }}>جاري تحميل الفروع... ⏳</div>
      ) : branches.length === 0 ? (
         <div style={{ textAlign: 'center', padding: '50px' }}>لا توجد فروع مضافة حتى الآن.</div>
      ) : (
        <div className="branches-grid-wrapper">
          {branches.map((branch) => (
            <div key={branch.id} className="branch-list-card">
              <div className="branch-card-header">
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>🏪</div>
                <h3>{branch.branchName}</h3>
                <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>📞 {branch.branchPhone}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button 
                  onClick={() => setSelectedBranchId(branch.id)}
                  className="branch-details-btn"
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