import React, { useState } from 'react';
import './RegisterPage.css';

function RegisterPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    placeName: '',
    location: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://neama1.runasp.net/Api/JoinUs/ApplicationsToJoinPartner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("تم إرسال طلبك بنجاح! 🚀 سيقوم فريقنا بمراجعته والتواصل معك قريباً.");
        onNavigate('login');
      } else {
        const errorText = await response.text();
        console.error("تفاصيل خطأ الباك أند:", errorText);
        alert(`رفض السيرفر الطلب. الخطأ: ${errorText}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("تعذر الاتصال بالسيرفر. يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-right">
        <button className="back-btn-modern" onClick={() => onNavigate('landing')}>
          ↩ العودة للرئيسية
        </button>

        <h2 className="register-title">طلب انضمام كشريك</h2>
        <p className="register-subtitle">سجل بيانات متجرك الآن وسيقوم فريقنا بالتواصل معك لتفعيل حسابك.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group-reg">
            <label className="form-label-reg">الاسم بالكامل *</label>
            <input 
              className="form-input-reg" 
              type="text" 
              name="fullName" 
              placeholder="مثال: أحمد محمد" 
              value={formData.fullName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group-reg">
            <label className="form-label-reg">رقم الموبايل *</label>
            <input 
              className="form-input-reg" 
              style={{ textAlign: 'right' }} 
              type="tel" 
              name="phone" 
              placeholder="01xxxxxxxxx" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              dir="ltr" 
            />
          </div>

          <div className="form-group-reg">
            <label className="form-label-reg">اسم المحل / النشاط *</label>
            <input 
              className="form-input-reg" 
              type="text" 
              name="placeName" 
              placeholder="مثال: مخبوزات السعادة" 
              value={formData.placeName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group-reg">
            <label className="form-label-reg">الموقع (المحافظة / المنطقة) *</label>
            <input 
              className="form-input-reg" 
              type="text" 
              name="location" 
              placeholder="مثال: القاهرة، المعادي" 
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group-reg">
            <label className="form-label-reg">البريد الإلكتروني</label>
            <input 
              className="form-input-reg" 
              style={{ textAlign: 'right' }} 
              type="email" 
              name="email" 
              placeholder="example@domain.com" 
              value={formData.email} 
              onChange={handleChange} 
              dir="ltr" 
            />
          </div>

          <button type="submit" className="submit-btn-reg" disabled={loading}>
            {loading ? 'جاري الإرسال...' : 'إرسال طلب الانضمام 🚀'}
          </button>
        </form>

        <div className="bottom-link-row">
          لديك حساب بالفعل؟ <span className="mint-link" onClick={() => onNavigate('login')}>تسجيل الدخول</span>
        </div>
      </div>

      <div className="register-left">
        <div className="register-left-content">
          <h2>اكسب أكثر، واهدر أقل 🍃</h2>
          <p>
            انضمامك لمنصة نعمة كشريك هيساعدك تحول فائض الطعام اليومي لإيرادات إضافية، وتجذب عملاء جدد لعلامتك التجارية بكل سهولة.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;