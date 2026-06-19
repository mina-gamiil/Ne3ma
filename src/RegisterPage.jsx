import React, { useState } from 'react';

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

  const styles = {
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', direction: 'rtl', overflow: 'hidden' },
    rightSide: { flex: 1, backgroundColor: 'white', padding: '40px 8%', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
    leftSide: { flex: 1, background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '40px', textAlign: 'center' },
    backBtn: { alignSelf: 'flex-start', background: 'none', border: 'none', color: '#64748b', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', transition: '0.2s' },
    title: { fontSize: '32px', fontWeight: '900', color: '#1e293b', marginBottom: '8px' },
    subtitle: { fontSize: '15px', color: '#64748b', marginBottom: '30px' },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#f8fafc' },
    submitBtn: { width: '100%', backgroundColor: '#14b8a6', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', transition: '0.2s' },
    loginLink: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b' },
    linkSpan: { color: '#14b8a6', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.rightSide}>
        <button style={styles.backBtn} onClick={() => onNavigate('landing')}>
          ↩ العودة للرئيسية
        </button>

        <h2 style={styles.title}>طلب انضمام كشريك</h2>
        <p style={styles.subtitle}>سجل بيانات متجرك الآن وسيقوم فريقنا بالتواصل معك لتفعيل حسابك.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>الاسم بالكامل *</label>
            <input style={styles.input} type="text" name="fullName" placeholder="مثال: أحمد محمد" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>رقم الموبايل *</label>
            <input style={{ ...styles.input, textAlign: 'right' }} type="tel" name="phone" placeholder="01xxxxxxxxx" value={formData.phone} onChange={handleChange} required dir="ltr" />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>اسم المحل / النشاط *</label>
            <input style={styles.input} type="text" name="placeName" placeholder="مثال: مخبوزات السعادة" value={formData.placeName} onChange={handleChange} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>الموقع (المحافظة / المنطقة) *</label>
            <input style={styles.input} type="text" name="location" placeholder="مثال: القاهرة، المعادي" value={formData.location} onChange={handleChange} required />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>البريد الإلكتروني</label>
            <input style={{ ...styles.input, textAlign: 'right' }} type="email" name="email" placeholder="example@domain.com" value={formData.email} onChange={handleChange} dir="ltr" />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'جاري الإرسال...' : 'إرسال طلب الانضمام 🚀'}
          </button>
        </form>

        <div style={styles.loginLink}>
          لديك حساب بالفعل؟ <span style={styles.linkSpan} onClick={() => onNavigate('login')}>تسجيل الدخول</span>
        </div>
      </div>

      <div style={styles.leftSide} className="hide-on-mobile">
        <div>
          <h2 style={{ fontSize: '38px', fontWeight: '900', marginBottom: '20px' }}>اكسب أكثر، واهدر أقل 🍃</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.8', opacity: '0.9', maxWidth: '400px', margin: '0 auto' }}>
            انضمامك لمنصة نعمة كشريك هيساعدك تحول فائض الطعام اليومي لإيرادات إضافية، وتجذب عملاء جدد لعلامتك التجارية بكل سهولة.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;