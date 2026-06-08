import React from 'react';
import HeroSection from '../components/HeroSection';
import SEOHead from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <SEOHead
        title={t('home.seoTitle')}
        description={t('home.seoDesc')}
      />
      <HeroSection />
    </div>
  );
};

export default Home;
