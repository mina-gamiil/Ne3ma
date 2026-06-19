import React, { useState } from 'react';
import WelcomePage from './WelcomePage';
import ChatPage from './ChatPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
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