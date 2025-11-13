import React from 'react';

const HeroBackground = () => (
    <div className="absolute inset-0 opacity-30">
      <svg className="w-full h-full" viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path d="M0,100 C300,200 900,50 1200,150 L1200,300 L0,300 Z" fill="rgba(255,255,255,0.1)" />
      </svg>
    </div>
);

export default HeroBackground;