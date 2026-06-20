import React, { useState } from 'react';
import WelcomePage from './components/WelcomPage/WelcomePage';
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import PartnerDashboard from './components/PartnerDashboard/PartnerDashboard';
import BranchDashboard from './components/BranchDashboard/BranchDashboard';  
import './App.css';
function App() {
  
  const [currentPage, setCurrentPage] = useState('landing'); 
  return (
    <div className="app-viewport">
      
      {currentPage === 'landing' && <WelcomePage onNavigate={setCurrentPage} />}
      {currentPage === 'chat' && <ChatPage onNavigate={setCurrentPage} />}
      {currentPage === 'login' && <LoginPage onNavigate={setCurrentPage} />}
      {currentPage === 'register' && <RegisterPage onNavigate={setCurrentPage} />}
      {currentPage === 'admin_dashboard' && <AdminDashboard onNavigate={setCurrentPage} />}
      {currentPage === 'partner_dashboard' && <PartnerDashboard onNavigate={setCurrentPage} />}
      {currentPage === 'branch_dashboard' && <BranchDashboard onNavigate={setCurrentPage} />}
    </div>
  );
}

export default App;