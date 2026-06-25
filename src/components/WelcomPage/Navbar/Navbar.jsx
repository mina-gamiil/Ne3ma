import React from 'react';
import './Navbar.css';

function Navbar({ onNavigate }) {
  return (
    <nav className="top-mini-nav">
      <div className="nav-right-brand" onClick={() => onNavigate('landing')}>
        <div className="logo-images-container">
          <img src="/Image/icon.svg" alt="logo" className="navbar-logo-img" />
          
          <img src="/Image/نعمه.svg" alt="نعمة" className="navbar-logo-img logo-ar" />
        </div>
       
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