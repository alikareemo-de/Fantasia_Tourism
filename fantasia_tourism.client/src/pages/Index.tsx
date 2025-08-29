
import React from 'react';
import Navigation from '@/components/Navigation';
import Banner from '@/components/Banner';
import CitiesSection from '@/components/CitiesSection';
//import OffersSection from '@/components/OffersSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow">
        <Banner />
        <CitiesSection />
      {/*  <OffersSection />*/}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
