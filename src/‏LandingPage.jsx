import React, { useState } from 'react';

function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert(`جاري تسجيل الدخول بحساب: ${email}`);
  };

  const styles = {
    container: { display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'white' },
    rightSide: { width: '50%', background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', padding: '40px' },
    visualBox: { maxWidth: '450px', textAlign: 'center' },
    brandTitle: { fontSize: '64px', fontWeight: '900', marginBottom: '15px' },
    slogan: { fontSize: '18px', marginBottom: '40px', opacity: 0.9 },
    tag: { background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', padding: '14px 20px', borderRadius: '8px', marginBottom: '15px', fontSize: '15px', textAlign: 'right' },
    leftSide: { width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px', position: 'relative' },
    backBtn: { position: 'absolute', top: '30px', left: '40px', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' },
    coreBox: { width: '100%', maxWidth: '400px' },
    title: { fontSize: '28px', color: '#1f2937', marginBottom: '10px', fontWeight: '800' },
    subtext: { color: '#64748b', fontSize: '15px', marginBottom: '35px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#4b5563', textAlign: 'right' },
    input: { padding: '14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '15px', outline: 'none', backgroundColor: '#f9fafb', textAlign: 'right' },
    forgotRow: { textAlign: 'left', marginBottom: '25px' },
    forgotLink: { color: '#14b8a6', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
    submitBtn: { width: '100%', backgroundColor: '#14b8a6', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
    noAccount: { textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#64748b' },
    greenLink: { color: '#14b8a6', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.container} dir="rtl">
      <div style={styles.rightSide}>
        <div style={styles.visualBox}>
          <h1 style={styles.brandTitle}>نعمة</h1>
          <p style={styles.slogan}>نحن نحول <b>الهدر</b> إلى <b>إيرادات</b></p>
          <div style={styles.tag}>🏪 قم بإدارة متاجرك ومخزونك بسهولة</div>
          <div style={styles.tag}>📊 تتبع المبيعات والتحليلات في الوقت الفعلي</div>
        </div>
      </div>

      <div style={styles.leftSide}>
        <span style={styles.backBtn} onClick={() => onNavigate('landing')}>العودة للرئيسية ↩</span>
        <div style={styles.coreBox}>
          <h2 style={styles.title}>تسجيل الدخول لمدير المتجر</h2>
          <p style={styles.subtext}>مرحباً بعودتك! يرجى تسجيل الدخول للمتابعة.</p>
          <form onSubmit={handleLoginSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>البريد الإلكتروني *</label>
              <input style={styles.input} type="email" placeholder="بريدك الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>كلمة المرور *</label>
              <input style={styles.input} type="password" placeholder="كلمة المرور الخاصة بك" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div style={styles.forgotRow}>
              <span style={styles.forgotLink}>نسيت كلمة المرور؟</span>
            </div>
            <button type="submit" style={styles.submitBtn}>تسجيل الدخول</button>
          </form>
          <p style={styles.noAccount}>
            ليس لديك حساب متجر؟ <span style={styles.greenLink} onClick={() => onNavigate('landing')}>سجل متجرك الآن</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;