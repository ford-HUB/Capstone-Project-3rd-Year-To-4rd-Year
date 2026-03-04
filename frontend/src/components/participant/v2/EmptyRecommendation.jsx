import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { asset } from '../../../assets/asset';
import { NavLink } from 'react-router-dom';

const EmptyRecommendation = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4'>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-purple-100 rounded-full opacity-20 animate-pulse delay-75"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-100 rounded-full opacity-20 animate-pulse delay-150"></div>
      </div>

      <div className='flex flex-col justify-center items-center relative z-10 max-w-md mx-auto'>
        
        <div className='flex justify-center items-center mb-8 relative'>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full blur-xl opacity-20 animate-pulse scale-150"></div>
          <div className='relative bg-white rounded-full p-6 shadow-2xl ring-1 ring-gray-100 transform transition-all duration-300'>
            <img 
              className='h-16 w-16 object-contain filter drop-shadow-lg' 
              src={asset.bot} 
              alt="AI agent" 
            />
            
            <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-blue-600 animate-bounce" />
            <Sparkles className="absolute -bottom-1 -left-2 h-3 w-3 text-red-600 animate-bounce delay-75" />
          </div>
        </div>

        <div className='relative'>
          <div className="absolute inset-0 bg-white rounded-3xl shadow-lg transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl shadow-lg transform -rotate-1"></div>
          
          <div className='relative bg-white text-center p-8 rounded-3xl shadow-xl border border-gray-100 transform transition-all duration-300'>
            <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-4 opacity-50" />
            
            <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              No Events Found
            </h3>
            
            <p className="text-gray-600 leading-relaxed text-sm">
              Our AI agent couldn't find any events 
              <br className="hidden sm:block" />
              <span className="block sm:inline"> matching your criteria right now.</span>
            </p>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Try adjusting your interest or check back later
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <NavLink to={'/participant/profile?tab=interest'} className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Explore More Options
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default EmptyRecommendation;