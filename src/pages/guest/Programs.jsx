import React from 'react';
import { asset } from '../../assets/asset';

export default function UCLMCaresUI() {
  return (
    <div className="bg-gray-100 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto relative">
        <div className="space-y-16 relative z-10">
          <div className="relative bg-white shadow-lg rounded-xl p-10 min-h-[400px] flex flex-col justify-start overflow-hidden">
            <img
              src={asset.transparentLogo}
              alt="logo"
              className="absolute top-5 left-68 w-90 h-90 object-cover opacity-20 pointer-events-none rounded-xl"
            />

            <h1 className="text-4xl font-bold mb-4 relative z-10">
              <span className="text-blue-600">UCLM-Cares</span>{' '}
              <span className="text-black">Mission & Goals</span>
            </h1>
            <p className="text-2xl text-black leading-relaxed mt-12 relative z-10">
              UCLM Cares is committed to supporting communities through education, healthcare,
              and social welfare initiatives. Our programs focus on empowering individuals and
              improving lives.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-10 min-h-96 flex">
            {/* Left side - Programs list */}
            <div className="flex-1 pr-8">
              <h2 className="text-3xl font-bold mb-8">
                <span className="text-blue-500">Featured</span>{' '}
                <span className="text-red-500">Programs</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <span className="text-lg text-gray-700">Scholarship Assistance</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍽️</span>
                  <span className="text-lg text-gray-700">Community Feeding Program</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏥</span>
                  <span className="text-lg text-gray-700">Medical Missions</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌱</span>
                  <span className="text-lg text-gray-700">Environmental Initiatives</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Image grid */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {/* Top left - Group photo in blue shirts */}
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={asset.fourOne}
                  alt="Free Breakfast Event"
                  className="w-full h-full object-cover"
                />
              </div>

              
              {/* Top right - Group with banner */}
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={asset.fourTwo}
                  alt="Community event with banner" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Bottom left - Medical mission */}
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={asset.fourThree}
                  alt="Medical mission activity" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Bottom right - Environmental/community event */}
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={asset.fourFour} 
                  alt="Environmental initiative" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-10 min-h-[400px] flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Healthcare Initiatives</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our healthcare programs focus on preventive care, health education, and improving access
              to medical services in remote and underserved areas.
            </p>
            <ul className="list-disc mt-6 pl-5 space-y-2 text-gray-700">
              <li>Key initiative 1 for healthcare initiatives</li>
              <li>Key initiative 2 for healthcare initiatives</li>
              <li>Key initiative 3 for healthcare initiatives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
