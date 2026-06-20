import React from 'react';
import './Navbar.css';

function Navbar({ onNavigate }) {
  return (
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
  );
}

export default Navbar;