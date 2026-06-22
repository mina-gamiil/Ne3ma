import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './LoginPage.css';

function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://neama1.runasp.net/Api/Account/SignIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json(); 
        
        const decodedToken = jwtDecode(data.token);
        
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedToken.role;

        if (userRole === "Admin") {
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("userRole", "Admin");
          alert(`مرحباً بك يا أدمن: ${data.name} 💻`);
          onNavigate("admin_dashboard");
          
        } else if (userRole === "Partner") {
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("userRole", "Partner");
          alert(`أهلاً بك يا شريك النعمة (صاحب البراند): ${data.name} 🏪`);
          onNavigate("partner_dashboard");
          
        } else if (userRole === "Branch") {
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("userRole", "Branch");
          alert(`مرحباً بمدير الفرع: ${data.name} 🔑`);
          onNavigate("branch_dashboard");
          
        } else if (userRole === "User") {
          alert("عفواً! هذا الحساب مخصص للعملاء عبر تطبيق الموبايل فقط، ولا يمكنه دخول لوحة تحكم الويب الخاص بالمتاجر.");
          setIsLoading(false);
          return;
        } else {
          alert("نوع الحساب غير معروف أو غير مصرح له بالدخول.");
        }

      } else {
        alert("فشل تسجيل الدخول! تأكد من البريد الإلكتروني وكلمة المرور.");
      }
    } catch (error) {
      console.error("Login Live API Error:", error);
      alert("عفواً، تعذر الاتصال بالسيرفر. تأكد من اتصالك بالإنترنت.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <span className="back-btn" onClick={() => onNavigate('landing')}>العودة للرئيسية ↩</span>

      <div className="login-right">
        <h1 className="brand-title">نعمة</h1>
        <p className="slogan">نحن نحول <b>الهدر</b> إلى <b>إيرادات</b></p>
        <div className="feature-tag">🏪 قم بإدارة متاجرك ومخزونك بسهولة</div>
        <div className="feature-tag">📊 تتبع المبيعات والتحليلات في الوقت الفعلي</div>
      </div>

      <div className="login-left">
        <div className="form-core-box">
          <h2 className="form-title">تسجيل الدخول لمدير المتجر</h2>
          <p className="form-subtext">مرحباً بعودتك! يرجى تسجيل الدخول للمتابعة.</p>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="input-group">
              <label className="input-label">البريد الإلكتروني *</label>
              <input className="custom-input" type="email" placeholder="بريدك الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">كلمة المرور *</label>
              <input className="custom-input" type="password" placeholder="كلمة المرور الخاصة بك" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="forgot-row">
              <span className="forgot-link">نسيت كلمة المرور؟</span>
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "جاري التحقق ..." : "تسجيل الدخول"}
            </button>
          </form>
          
          <p className="no-account-text">
            ليس لديك حساب متجر؟ <span className="green-link" onClick={() => onNavigate('register')}>سجل متجرك الآن</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;