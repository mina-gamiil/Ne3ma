import React, { useState } from 'react';

export default function AddPartnerTab() {
  const [partnerForm, setPartnerForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch("https://neama1.runasp.net/Api/AdminDashboard/partner", {
        method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(partnerForm)
      });
      if (res.ok) {
        alert("تم إنشاء حساب الشريك بنجاح! 🎉");
        setPartnerForm({ name: '', email: '', password: '' });
      } else alert("حدث خطأ.");
    } catch (error) { alert("خطأ في الاتصال"); } 
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '40px', maxWidth: '600px', width: '100%' }}>
        <h3 style={{ textAlign: 'center', fontSize: '22px', fontWeight: '900', marginBottom: '30px' }}>🏪 إنشاء حساب شريك جديد</h3>
        <form onSubmit={handleAdd}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>اسم المتجر</label>
            <input type="text" value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} required style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>البريد الإلكتروني</label>
            <input type="email" dir="ltr" value={partnerForm.email} onChange={e => setPartnerForm({...partnerForm, email: e.target.value})} required style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>كلمة المرور</label>
            <input type="text" dir="ltr" value={partnerForm.password} onChange={e => setPartnerForm({...partnerForm, password: e.target.value})} required style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc'}} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#0f766e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب الشريك 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}