import React, { useState, useRef, useEffect } from 'react';
import './ChatPage.css';

function ChatPage({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { text: "أهلاً بك في نعمه! 👋 أنت صاحب محل عايز تقلل الهدر وتزود الدخل، ولا عميل عايز يشتري؟", sender: "bot" }
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    placeName: "",
    location: "",
    email: ""
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStep]);

  const handleRuleOption = (optionText, nextStep, botReplyText) => {
    setMessages((prev) => [...prev, { text: optionText, sender: "user" }]);
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: botReplyText, sender: "bot" }]);
      setCurrentStep(nextStep);
      setIsLoading(false);
    }, 600);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://neama1.runasp.net/Api/JoinUs/ApplicationsToJoinPartner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "accept": "*/*"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessages((prev) => [
          ...prev, 
          { text: `تم إرسال البيانات بنجاح: \n👤 الاسم: ${formData.fullName}\n📞 الموبايل: ${formData.phone}\n🏪 المحل: ${formData.placeName}`, sender: "user" },
          { text: "شكراً لك يا شريك نعمه! 🎉 تم استلام طلب انضمامك بنجاح على سيرفر نعمه، وفريقنا هيتواصل معاك قريب جداً لتفعيل حسابك.", sender: "bot" }
        ]);
        setCurrentStep("form_submitted");
        setFormData({ fullName: "", phone: "", placeName: "", location: "", email: "" });
      } else {
        alert("السيرفر رجع خطأ، اتأكد إن البيانات مكتوبة صح.");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("تعذر الاتصال بالسيرفر، اتأكد إنك فاتح نت وسيرفر الباك اند شغال.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="figma-chat-container" dir="rtl">
      
      <nav className="figma-chat-nav">
        <div className="nav-right-side" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span className="nav-logo-text">Ne3ma | <b>نعمة</b></span>
          <button className="nav-home-btn" onClick={() => onNavigate('landing')}>الرئيسية 🏠</button>
        </div>
        <div className="nav-left-side">
          <button className="nav-lang-btn" onClick={() => onNavigate('landing')}>English</button>
        </div>
      </nav>

      <div className="figma-chat-body">
        <div className="chat-history-wrapper">
          
          {messages.map((msg, i) => (
            <div key={i} className={`real-chat-row ${msg.sender}`}>
              <div className="real-chat-bubble" style={{ whiteSpace: 'pre-line' }}>
                {msg.text}
              </div>
            </div>
          ))}

          {currentStep === "show_merchant_form" && !isLoading && (
            <div className="real-chat-row bot" style={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div className="ne3ma-form-card">
                <div className="form-header-badge">تمام 🙌 ممكن تملي البيانات السريعة تحت عشان نبدأ معاك.</div>
                
                <form onSubmit={handleFormSubmit} className="ne3ma-actual-form">
                  <div className="ne3ma-input-block">
                    <label>الاسم الكامل *</label>
                    <input type="text" name="fullName" placeholder="أدخل اسمك الكامل" value={formData.fullName} onChange={handleInputChange} required />
                  </div>

                  <div className="ne3ma-input-block">
                    <label>رقم الموبايل *</label>
                    <input type="tel" name="phone" placeholder="أدخل رقم الموبايل" value={formData.phone} onChange={handleInputChange} required />
                  </div>

                  <div className="ne3ma-input-block">
                    <label>اسم المحل (اختياري)</label>
                    <input type="text" name="placeName" placeholder="أدخل اسم المحل" value={formData.placeName} onChange={handleInputChange} />
                  </div>

                  <div className="ne3ma-input-block">
                    <label>الموقع (اختياري)</label>
                    <input type="text" name="location" placeholder="مثال: بنها، القليوبية" value={formData.location} onChange={handleInputChange} />
                  </div>

                  <div className="ne3ma-input-block">
                    <label>الإيميل (اختياري)</label>
                    <input type="email" name="email" placeholder="أدخل الإيميل الخاص بك" value={formData.email} onChange={handleInputChange} />
                  </div>

                  <div className="form-buttons-row">
                    <button type="submit" className="form-submit-btn">إرسال الطلب لايف 🚀</button>
                    <button type="button" className="form-cancel-btn" onClick={() => {
                      setCurrentStep("welcome");
                      setMessages((prev) => [...prev, { text: "تم إلغاء العملية، رجوع للبداية", sender: "bot" }]);
                    }}>إلغاء</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="real-chat-row bot">
              <div className="real-chat-bubble loading">جاري الاتصال بالسيرفر وإرسال البيانات...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="figma-chat-footer">
        <div className="footer-controls-container">
          
          {!isLoading && (
            <div className="figma-quick-replies-row">
              {currentStep === "welcome" && (
                <>
                  <button className="figma-reply-btn" onClick={() => handleRuleOption("أنا صاحب محل أكل 🏪", "show_merchant_form", "أهلاً بك يا شريك نعمه! يسعدنا جداً انضمامك لنا لتقليل الهدر وزيادة أرباحك.")}>أنا صاحب محل أكل 🏪</button>
                  <button className="figma-reply-btn" onClick={() => handleRuleOption("عايز أنزل التطبيق 📱", "customer_branch", "تطبيق نعمه للهواتف هيكون متوفر قريباً جداً على App Store و Google Play لحفظ النعمة بسهولة!")}>عايز أنزل التطبيق 📱</button>
                  <button className="figma-reply-btn" onClick={() => handleRuleOption("عايز أعرف أكتر عن نعمه 💡", "about_branch", "منصة نعمه بتقدم حلول ذكية لتقليل هدر المنتجات في مصر وتوصيل الفائض للمستهلكين بأسعار مخفضة.")}>عايز أعرف أكتر عن نعمه 💡</button>
                </>
              )}

              {(currentStep === "customer_branch" || currentStep === "about_branch") && (
                <button className="figma-reply-btn" onClick={() => { setCurrentStep("welcome"); setMessages((prev) => [...prev, { text: "اختر خطوة أخرى للبدء:", sender: "bot" }]); }}>↩ العودة للبداية</button>
              )}

              {currentStep === "form_submitted" && (
                <button className="figma-reply-btn success" onClick={() => onNavigate('landing')}>العودة للرئيسية 🏠</button>
              )}
            </div>
          )}

          <div className="figma-input-pill-wrapper">
            <input type="text" placeholder="التحكم متاح عبر الأزرار الفوقيه..." disabled />
            <button className="figma-send-circle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default ChatPage;