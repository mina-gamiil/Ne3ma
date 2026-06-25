import React, { useState } from 'react';
import './ForgotPassword.css';

export default function ForgotPassword({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("https://neama1.runasp.net/Api/Account/ForgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        setStep(2);
      } else {
        alert("حدث خطأ! تأكد من أن البريد الإلكتروني مسجل لدينا.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("تعذر الاتصال بالسيرفر. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("كلمتا المرور غير متطابقتين!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch("https://neama1.runasp.net/Api/Account/ResetPasword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
          newPassword: newPassword,
          confirmNewPassword: confirmPassword
        })
      });

      if (response.ok) {
        setStep(3);
      } else {
        const errorText = await response.text();
        alert(`فشل تغيير كلمة المرور! تأكد من صحة الكود. التفاصيل: ${errorText}`);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("تعذر الاتصال بالسيرفر. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2 className="brand-logo-green">نعمة</h2>
          
          {step === 1 && (
            <>
              <h3>نسيت كلمة المرور؟</h3>
              <p>أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق (OTP) لاستعادة حسابك.</p>
            </>
          )}
          
          {step === 2 && (
            <>
              <h3>تعيين كلمة مرور جديدة</h3>
              <p>أدخل الرمز الذي أرسلناه إلى <b>{email}</b> مع كلمة المرور الجديدة.</p>
            </>
          )}
          
          {step === 3 && (
            <>
              <h3>تم بنجاح! 🎉</h3>
              <p>تم تغيير كلمة المرور الخاصة بك بنجاح، يمكنك الآن تسجيل الدخول.</p>
            </>
          )}
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="forgot-password-form">
            <div className="input-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="reset-btn" disabled={isLoading}>
              {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="forgot-password-form">
            <div className="input-group">
              <label>رمز التحقق (OTP)</label>
              <input
                type="text"
                placeholder="أدخل الكود"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ letterSpacing: '3px', textAlign: 'center', fontSize: '18px' }}
                required
              />
            </div>
            <div className="input-group">
              <label>كلمة المرور الجديدة</label>
              <input
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>تأكيد كلمة المرور</label>
              <input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="reset-btn" disabled={isLoading}>
              {isLoading ? 'جاري التحقق والتغيير...' : 'حفظ كلمة المرور'}
            </button>
          </form>
        )}

        {step === 3 && (
          <button className="reset-btn" onClick={() => onNavigate('login')}>
            الذهاب لتسجيل الدخول
          </button>
        )}

        {step !== 3 && (
          <button
            className="back-to-login-btn"
            onClick={() => onNavigate('login')}
            type="button"
          >
            العودة لتسجيل الدخول
          </button>
        )}
      </div>
    </div>
  );
}