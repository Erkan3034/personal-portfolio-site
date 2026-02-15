import React from 'react';
import HeroSection from '../components/HeroSection';
import SEOHead from '../components/SEOHead';

const Home = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Yazılım Geliştirici & Full Stack Developer"
        description="Erkan Turgut'un kişisel portfolyo sitesi. Modern web teknolojileri, Python, Java ve AI projeleri geliştiren Full Stack Developer. AI Enthusiast"
      />
      <HeroSection />
    </div>
  );
};

export default Home; 