import React from 'react';
import './Features.css';

function Features() {
  return (
    <section className="features-grid-section">
      <div className="features-header">
        <h2 className="features-main-title">بناء عالم خالٍ من الهدر</h2>
        <p className="features-sub-title">
          نتصور عالماً حيث هدر المنتجات شيء من الماضي، حيث التكنولوجيا تربط المجتمعات، وحيث كل وجبة لها قيمة.
        </p>
      </div>

      <div className="features-carousel-container">
        

        <div className="features-cards-grid">
          <div className="feature-card-item">
            <div className="feature-text-content">
              <h3>الابتكار المستمر</h3>
              <p>تطوير ميزات وحلول جديدة لمعالجة هدر المنتجات</p>
            </div>
            
          </div>

          <div className="feature-card-item">
            <div className="feature-text-content">
              <h3>التوسع العالمي</h3>
              <p>جلب نظام نعمه إلى مدن عبر أنحاء الجمهورية وما وراءها</p>
            </div>
          </div>

          <div className="feature-card-item">
            <div className="feature-text-content">
              <h3>نظام بيئي كامل</h3>
              <p>إنشاء منصة شاملة تجمع كل جوانب إنقاذ المنتجات</p>
            </div>
          
          </div>

          <div className="feature-card-item">
            <div className="feature-text-content">
              <h3>التعليم والوعي</h3>
              <p>تعليم المجتمعات حول الاستدامة والاستهلاك الواعي</p>
            </div>
          
          </div>
        </div>

      
      </div>
    </section>
  );
}

export default Features;