import React from 'react';
import HeroBackground from './HeroBackground';
import UserHeader from '../headers/UserHeader';
import UserStats from '../headers/UserStats';

const HeroSection = ({ userData, accomplishmentData }) => (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-teal-700 relative overflow-hidden">
      <HeroBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="flex items-center justify-between">
          <UserHeader userData={userData} />
          <UserStats totalHours={userData} accomplishmentData={accomplishmentData}/>
        </div>
      </div>
    </div>
);

export default HeroSection;