import React from 'react';

function WelcomePage({ onNavigate }) {
  return (
    <div className="landing-page-master" dir="rtl">
      
      <nav className="top-mini-nav">
        <div className="nav-right-brand" onClick={() => onNavigate('landing')}>
          <h1 className="brand-logo-green">
            Ne3ma <span className="logo-slash">|</span> <span className="brand-arabic">نعمة</span>
          </h1>
          <span className="company-badge">An Egyptian Company</span>
        </div>
        
        <div className="nav-left-actions">
          <button className="nav-chat-shortcut-btn" onClick={() => onNavigate('chat')}>
            تحدث مع البوت 💬
          </button>
          <button className="nav-login-shortcut-btn" onClick={() => onNavigate('login')}>
            دخول المتاجر 🏪
          </button>
          
        </div>
      </nav>

      <div className="landing-scroll-body">
        
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

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px', justifyContent: 'center', width: '100%' }}>
              <button className="btn-mint-cta" onClick={() => onNavigate('chat')}>
                ابدأ الآن  ➔
              </button>
              <button 
                className="btn-mint-cta" 
                onClick={() => onNavigate('login')}
                style={{ backgroundColor: '#0f766e', boxShadow: '0 4px 6px rgba(15, 118, 110, 0.2)' }}
              >
                تسجيل دخول المتاجر 🏪
              </button>
            </div>
            <span className="under-btn-text">بدون رسوم تسجيل • التسجيل في دقيقتين • ابدأ البيع اليوم</span>
          </div>
        </header>

        <section className="our-story-modern-section">
          <div className="story-content-flex">
            
            <div className="story-text-side">
              <span className="story-badge">قصتنا</span>
              <h2 className="story-main-title">وُلدت من فكرة بسيطة</h2>
              <p className="story-description">
                في عام 2025  ، رأينا مشكلة تحتاج إلى حل. كل يوم، كانت أطنان من الطعام الجيد تُهدر بينما يكافح الناس لتحمل تكلفة الوجبات الجيدة. أنشأنا "نعمة" لسد هذه الفجوة، وتحويل الهدر إلى فرصة.
              </p>
              <div className="story-mission-box">
                مهمتنا هي إنشاء نظام غذائي مستدام حيث لا شيء يُهدر والجميع يستفيد.
              </div>
            </div>

            <div className="story-cards-side">
              <div className="story-white-card">
                <div className="card-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                  <i className="fas fa-leaf"></i>
                </div>
                <div className="card-text">
                  <h4>الاستدامة أولاً</h4>
                  <p>كل وجبة محفوظة هي خطوة نحو مستقبل أكثر استدامة.</p>
                </div>
              </div>

              <div className="story-white-card">
                <div className="card-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                  <i className="fas fa-users"></i>
                </div>
                <div className="card-text">
                  <h4>مدفوع بالمجتمع</h4>
                  <p>بناء الروابط بين المتاجر والمستهلكين الواعين بيئياً.</p>
                </div>
              </div>

              <div className="story-white-card">
                <div className="card-icon" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
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

        <section className="how-it-works-section">
          <h2 className="section-title-main">كيف يعمل نظام <span className="brand-accent">نعمة | NE3MA</span></h2>
          <div className="steps-grid-container">
            <div className="step-card-modern">
              <span className="step-badge-num">1</span>
              <div className="step-card-icon">🤝</div>
              <h4>انضم للمنصة</h4>
              <p>إعداد صفحة المتجر لعلامتك التجارية في دقائق وابدأ التحكم في هدر الطعام اليوم.</p>
            </div>
            <div className="step-card-modern">
              <span className="step-badge-num">2</span>
              <div className="step-card-icon">🏪</div>
              <h4>اعرض فائضك</h4>
              <p>حول طعامك الزائد إلى إيرادات إضافية من خلال تقديم وجبات أو مخبوزات بخصم 50%.</p>
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
              <p>احصل على دخل إضافي على كل وجبة، مع المساهمة الحقيقية في بيئة مستدامة ومثالية.</p>
            </div>
          </div>
        </section>

        <section 
          className="app-download-showcase" 
          style={{ 
            height: 'auto',          
            minHeight: 'fit-content', 
            padding: '50px 20px',    
            display: 'block',
            overflow: 'visible'
          }}
        >
          <div 
            className="app-showcase-flex" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              flexWrap: 'wrap', 
              gap: '30px', 
              maxWidth: '1000px', 
              margin: '0 auto' 
            }}
          >
            <div className="app-info-side" style={{ flex: '1 1 400px' }}>
              <h2>حمل تطبيق نعمة</h2>
              <p>
                حمل تطبيقنا للحصول على أفضل تجربة لتصفح وحجز الوجبات الفائضة النظيفة من حولك. وفر المال وساهم في حماية البيئة مع ميزات حصرية مخصصة للمستهلكين.
              </p>
              <div className="store-badge-buttons-row">
                <button className="store-action-btn">📥  حمل التطبيق الان</button>
              </div>
            </div>

            <div className="app-phones-visual-side" style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="phone-mockup-wrapper" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src="/Image/login-screen1.png" 
                  alt="Ne3ma App Login Screen" 
                  className="app-screenshot-img"
                  style={{ 
                    width: '100%', 
                    maxWidth: '210px', 
                    height: 'auto',    
                    objectFit: 'contain',
                    display: 'block', 
                    margin: '0 auto',
                    position: 'relative'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="ready-orange-footer-cta">
          <div className="orange-cta-inner">
            <h2>مستعد للبدء ؟</h2>
            <p>انضم إلى مئات المطاعم والمخابز التي باعت الفائض ووفرت ملايين الوجبات اليوم.</p>
            <button className="orange-action-btn-white-text" onClick={() => onNavigate('register')}>
              انضم كشريك الآن ➔
            </button>
          </div>
        </section>

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

      </div>
    </div>
  );
}

export default WelcomePage;