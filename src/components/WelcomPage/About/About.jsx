import React from 'react';
import './About.css';

function About() {
  return (
    <section className="our-story-modern-section">
      <div className="story-content-flex">
        
        <div className="story-text-side">
          <span className="story-badge">قصتنا</span>
          <h2 className="story-main-title">وُلدت من فكرة بسيطة</h2>
          <p className="story-description">
            في عام 2025 ، رأينا مشكلة تحتاج إلى حل. كل يوم، كانت أطنان من الطعام الجيد تُهدر بينما يكافح الناس لتحمل تكلفة الوجبات الجيدة. أنشأنا "نعمة" لسد هذه الفجوة، وتحويل الهدر إلى فرصة.
          </p>
          <div className="story-mission-box">
            مهمتنا هي إنشاء نظام غذائي مستدام حيث لا شيء يُهدر والجميع يستفيد.
          </div>
        </div>

        <div className="story-cards-side">
          <div className="story-white-card">
            <div className="card-icon icon-green">
              <i className="fas fa-leaf"></i>
            </div>
            <div className="card-text">
              <h4>الاستدامة أولاً</h4>
              <p>كل وجبة محفوظة هي خطوة نحو مستقبل أكثر استدامة.</p>
            </div>
          </div>

          <div className="story-white-card">
            <div className="card-icon icon-blue">
              <i className="fas fa-users"></i>
            </div>
            <div className="card-text">
              <h4>مدفوع بالمجتمع</h4>
              <p>بناء الروابط بين المتاجر والمستهلكين الواعين بيئياً.</p>
            </div>
          </div>

          <div className="story-white-card">
            <div className="card-icon icon-orange">
              <i className="fas fa-lightbulb"></i>
            </div>
            <div className="card-text">
              <h4>التركيز على الابتكار</h4>
              <p>استخدام التكنولوجيا لحل المشاكل الحقيقية في هدر الطعام.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default About;