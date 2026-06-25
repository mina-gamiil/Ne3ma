import React from 'react';
import './HowItWorks.css';

function HowItWorks() {
  return (
    <section className="how-it-works-section">
      <h2 className="section-title-main">كيف يعمل نظام <span className="brand-accent">نعمه | NEAMA</span></h2>
      <div className="steps-grid-container">
        <div className="step-card-modern">
          <span className="step-badge-num">1</span>
          <div className="step-card-icon">🤝</div>
          <h4>انضم للمنصة</h4>
          <p>إعداد صفحة المتجر لعلامتك التجارية في دقائق وابدأ التحكم في هدر منتاجاتك اليوم.</p>
        </div>
        <div className="step-card-modern">
          <span className="step-badge-num">2</span>
          <div className="step-card-icon">🏪</div>
          <h4>اعرض فائضك</h4>
          <p>حول منتاجاتك الزائده إلى إيرادات إضافية من خلال تقديم المنتاجات بخصم 50%.</p>
        </div>
        <div className="step-card-modern">
          <span className="step-badge-num">3</span>
          <div className="step-card-icon">📱</div>
          <h4>توصيل للعملاء</h4>
          <p>تواصل مع آلاف العملاء المهتمين بالبيئة وبالتوفير من حولك مباشرة.</p>
        </div>
        <div className="step-card-modern">
          <span className="step-badge-num">4</span>
          <div className="step-card-icon">💰</div>
          <h4>اكسب ووفر</h4>
          <p>احصل على دخل إضافي على كل منتج، مع المساهمة الحقيقية في بيئة مستدامة ومثالية.</p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;