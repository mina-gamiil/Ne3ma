import React from 'react';
import './CtaSection.css';

function CtaSection({ onNavigate }) {
  return (
    <section className="ready-orange-footer-cta">
      <div className="orange-cta-inner">
        <h2>مستعد للبدء ؟</h2>
        <p>انضم إلى مئات المتاجر التي باعت الفائض ووفرت ملايين المنتاجات اليوم.</p>
        <button className="orange-action-btn-white-text" onClick={() => onNavigate('register')}>
          انضم كشريك الآن ➔
        </button>
      </div>
    </section>
  );
}

export default CtaSection;