import React from 'react';
import './Features.css';

function Features() {
  return (
    <section className="features-grid-section">
      <div className="features-header">
        <h2 className="features-main-title">بناء عالم خالٍ من الهدر</h2>
        <p className="features-sub-title">
          نتصور عالماً حيث هدر الطعام شيء من الماضي، حيث التكنولوجيا تربط المجتمعات، وحيث كل وجبة لها قيمة.
        </p>
      </div>

      <div className="features-carousel-container">
        <button className="carousel-nav-btn"><i className="fas fa-chevron-right"></i></button>

        <div className="features-cards-grid">
          <div className="feature-card-item">
            <div className="feature-text-content">
              <h3>الابتكار المستمر</h3>
              <p>تطوير ميزات وحلول جديدة لمعالجة هدر الطعام</p>
            </div>
            <div className="feature-icon-box"><i className="fas fa-bolt"></i></div>
          </div>

          <div className="feature-card-item">
            <div className="feature-text-content">
              <h3>التوسع العالمي</h3>
              <p>جلب نظام نعمة إلى مدن عبر أنحاء الجمهورية وما وراءها</p>
            </div>
            <div className="feature-icon-box"><i className="fas fa-globe"></i></div>
          </div>

          <div className="feature-card-item">
            <div className="feature-text-content">
              <h3>نظام بيئي كامل</h3>
              <p>إنشاء منصة شاملة تجمع كل جوانب إنقاذ الطعام</p>
            </div>
            <div className="feature-icon-box"><i className="fas fa-project-diagram"></i></div>
          </div>

          <div className="feature-card-item">
            <div className="feature-text-content">
              <h3>التعليم والوعي</h3>
              <p>تعليم المجتمعات حول الاستدامة والاستهلاك الواعي</p>
            </div>
            <div className="feature-icon-box"><i className="fas fa-graduation-cap"></i></div>
          </div>
        </div>

        <button className="carousel-nav-btn"><i className="fas fa-chevron-left"></i></button>
      </div>
    </section>
  );
}

export default Features;