import React from 'react';
import Navbar from './Navbar/Navbar';
import Hero from './Hero/Hero';
import About from './About/About';
import Features from './Feature/Features';
import HowItWorks from './HowItWorks/HowItWorks';
import AppDownload from './AppDownload/AppDownload';
import CtaSection from './CtaSection/CtaSection';
import Footer from './Footer/Footer';


function WelcomePage({ onNavigate }) {
  return (
    <div className="landing-page-master" dir="rtl">
      <Navbar onNavigate={onNavigate} />
      
      <div className="landing-scroll-body">
        <Hero onNavigate={onNavigate} />
        <About />
        <Features />
        <HowItWorks />
        <AppDownload />
        <CtaSection onNavigate={onNavigate} />
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
}

export default WelcomePage;