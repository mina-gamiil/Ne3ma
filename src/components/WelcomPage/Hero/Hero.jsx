import React from 'react';
import './Hero.css';

function Hero({ onNavigate }) {
  return (
    <header className="hero-bakery-section">
      <div className="dark-overlay-layer">
        <div className="badge-top-orange">✨ منصة تقليل هدر الطعام الأولى في مصر</div>
        
        <h2 className="hero-main-title">
          حوّل طعامك الفائض إلى <br />
          <span className="text-mint-neon">إيرادات إضافية وبكل سهولة</span>
        </h2>
        
        <p className="hero-sub-p">
          انضم الآن إلى أكثر من 100 مطعم ومخبز يحققون دخلاً إضافياً من بيع الطعام الفائض النظيف للعملاء المهتمين بالبيئة وتوفير المال. لا للهدر.. زد أرباحك.
        </p>

        <div className="hero-info-badges">
          <div className="gray-info-badge">💰 اكسب من 400 لـ 2000+ جنيه يومياً من الفائض</div>
          <div className="gray-info-badge">🍃 قلل هدر الطعام في محلك بنسبة تصل لـ 50%</div>
          <div className="gray-info-badge">📱 إدارة بسيطة وسريعة بضغطات زرار واحدة</div>
        </div>

        <div className="hero-cta-buttons-group">
          <button className="btn-mint-cta" onClick={() => onNavigate('chat')}>
            ابدأ الآن  ➔
          </button>
          <button className="btn-mint-cta btn-partner-login" onClick={() => onNavigate('login')}>
            تسجيل دخول المتاجر 🏪
          </button>
        </div>
        <span className="under-btn-text">بدون رسوم تسجيل • التسجيل في دقيقتين • ابدأ البيع اليوم</span>
      </div>
    </header>
  );
}

export default Hero;