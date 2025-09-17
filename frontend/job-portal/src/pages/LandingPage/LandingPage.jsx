import React from 'react';
import Header from '../../components/landingPage/Header';
import Hero from '../../components/landingPage/Hero';
import Features from '../../components/landingPage/Features';
import Analytics from '../../components/landingPage/Analytics';
import Footer from '../../components/landingPage/Footer';

const LandingPage = () => {
  return (
    <div className='min-h-screen'>
      <Header />
      <Hero />
      <Features />
      <Analytics />
      <Footer />
    </div>
  )
}

export default LandingPage
