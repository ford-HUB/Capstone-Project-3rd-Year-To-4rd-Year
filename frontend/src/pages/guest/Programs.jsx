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

          <div className="bg-white shadow-lg rounded-xl p-10 min-h-96">
            {/* Top section with programs and images */}
            <div className="flex">
              {/* Left side - Programs list */}
              <div className="flex-1 pr-8">
                <h2 className="text-3xl font-bold mb-8">
                  <span className="text-blue-500">Featured</span>{' '}
                  <span className="text-red-500">Programs</span>
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-2xl">📚</span>
                    <span className="text-lg text-gray-700">Community Feeding Program</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-2xl">🍽️</span>
                    <span className="text-lg text-gray-700">Environmental Initiatives</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-2xl">🏥</span>
                    <span className="text-lg text-gray-700">Medical Missions</span>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-2xl">🌱</span>
                    <span className="text-lg text-gray-700">Scholarship Assistance</span>
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
            
            {/* Description Text at bottom - inside the same container */}
            <div className="mt-8 pt-3">
              <p className="text-gray-700 leading-relaxed italic text-lg">
                Our programs support communities through Scholarship Assistance for students, Community Feeding for 
                families, Medical Missions for healthcare, Environmental Initiatives for sustainability, and Skills Training for 
                livelihoods, creating a brighter future for all.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-10 min-h-120 flex flex-col">
            <h2 className="text-2xl font-bold text-black mb-8 text-center">Impact & Success Stories</h2>
            
            <div className="flex gap-6 flex-1">
              {/* Card 1 */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <img src={asset.impactPic1} alt="Success Story 1" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 h-32 bg-white">
                  <h3 className="font-semibold text-black text-lg mb-2">Community Impact</h3>
                  <p className="text-gray-600 text-sm">Extending a Helping Hand: Relief Distribution for Fire Victims in Sitio Pokang, Looc & Purok Orchids, Purok Waling Waling Opao, Mandaue City</p>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <img src={asset.impactPic2} alt="Success Story 2" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 h-32 bg-white">
                  <h3 className="font-semibold text-black text-lg mb-2">Educational Excellence</h3>
                  <p className="text-gray-600 text-sm">Students in our scholarship program have achieved a 95% graduation rate, with many going on to pursue higher education.</p>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  <img src={asset.impactPic3} alt="Success Story 3" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 h-53 bg-white">
                  <h3 className="font-semibold text-black text-lg mb-2">Environmental Progress</h3>
                  <p className="text-gray-600 text-sm">UCLM CARES volunteers, consisting of faculty, non-teaching staff, students, and alumni from various departments, successfully participated in World Clean Up Day 2024.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
