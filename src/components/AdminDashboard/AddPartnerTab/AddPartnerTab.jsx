import React, { useState } from 'react';
import './AddPartnerTab.css';

export default function AddPartnerTab() {
  const [partnerForm, setPartnerForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch("https://neama1.runasp.net/Api/AdminDashboard/partner", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(partnerForm)
      });
      if (res.ok) {
        alert("تم إنشاء حساب الشريك بنجاح! 🎉");
        setPartnerForm({ name: '', email: '', password: '' });
      } else {
        alert("حدث خطأ.");
      }
    } catch (error) {
      alert("خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-partner-wrapper">
      <div className="add-partner-card">
        <h3 className="add-partner-title">🏪 إنشاء حساب شريك جديد</h3>
        <form onSubmit={handleAdd}>
          <div className="add-partner-group">
            <label className="add-partner-label">اسم المتجر</label>
            <input
              type="text"
              className="add-partner-input"
              value={partnerForm.name}
              onChange={e => setPartnerForm({ ...partnerForm, name: e.target.value })}
              required
            />
          </div>
          
          <div className="add-partner-group">
            <label className="add-partner-label">البريد الإلكتروني</label>
            <input
              type="email"
              dir="ltr"
              className="add-partner-input"
              value={partnerForm.email}
              onChange={e => setPartnerForm({ ...partnerForm, email: e.target.value })}
              required
            />
          </div>
          
          <div className="add-partner-group">
            <label className="add-partner-label">كلمة المرور</label>
            <input
              type="text"
              dir="ltr"
              className="add-partner-input"
              value={partnerForm.password}
              onChange={e => setPartnerForm({ ...partnerForm, password: e.target.value })}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="add-partner-submit">
            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب الشريك 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}