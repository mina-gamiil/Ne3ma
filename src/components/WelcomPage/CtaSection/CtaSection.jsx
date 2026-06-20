import React from 'react';
import './CtaSection.css';

function CtaSection({ onNavigate }) {
  return (
    <section className="ready-orange-footer-cta">
      <div className="orange-cta-inner">
        <h2>مستعد للبدء ؟</h2>
        <p>انضم إلى مئات المطاعم والمخابز التي باعت الفائض ووفرت ملايين الوجبات اليوم.</p>
        <button className="orange-action-btn-white-text" onClick={() => onNavigate('register')}>
          انضم كشريك الآن ➔
        </button>
      </div>
    </section>
  );
}

export default CtaSection;