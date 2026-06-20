import React from 'react';
import './Footer.css';

function Footer({ onNavigate }) {
  return (
    <footer className="dark-footer-links">
      <div className="footer-cols">
        <div className="footer-col">
          <h5>منصة نعمة</h5>
          <p>رؤيتنا هي القضاء التام على هدر الطعام في مصر وتحقيق عوائد ذكية لأصحاب الأعمال.</p>
        </div>
        <div className="footer-col">
          <h5>روابط سريعة</h5>
          <p onClick={() => onNavigate('landing')}>الرئيسية</p>
          <p onClick={() => onNavigate('chat')}>الشات بوت التفاعلي</p>
          <p onClick={() => onNavigate('login')}>تسجيل المتاجر</p>
        </div>
        <div className="footer-col">
          <h5>تواصل معنا</h5>
          <p>📧 ne3ma.suport@gmail.com</p>
          <p>📞 19xxx للدعم الفني</p>
        </div>
      </div>
      <div className="footer-social-bottom">
        <p>© 2026 Ne3ma Project. جميع الحقوق محفوظة لشركاء النعمة. 🍃</p>
      </div>
    </footer>
  );
}

export default Footer;