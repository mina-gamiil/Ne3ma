import React from 'react';
import './AppDownload.css';

function AppDownload() {
  return (
    <section className="app-download-showcase">
      <div className="app-showcase-flex">
        <div className="app-info-side">
          <h2>حمل تطبيق نعمه</h2>
          <p>
            حمل تطبيقنا للحصول على أفضل تجربة لتصفح وحجز المنتجات الفائضة النظيفة من حولك. وفر المال وساهم في حماية البيئة مع ميزات حصرية مخصصة للمستهلكين.
          </p>
          <div className="store-badge-buttons-row">
            <button className="store-action-btn">📥   حمل التطبيق الان</button>
          </div>
        </div>

        <div className="app-phones-visual-side">
          <div className="phone-mockup-wrapper">
            <img 
              src="/image/login-screen1.png" 
              alt="Ne3ma App Login Screen" 
              className="app-screenshot-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppDownload;