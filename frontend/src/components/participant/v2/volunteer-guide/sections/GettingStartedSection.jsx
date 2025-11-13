import React from 'react';
import { BookOpen, Users, Award } from 'lucide-react';

const GettingStartedSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Welcome to UCLM CARES</h3>
            <p className="text-gray-600">Your comprehensive guide to volunteering</p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">
          The UCLM CARES system connects volunteers with meaningful community service opportunities. 
          This guide will help you navigate the platform and make the most of your volunteering experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Community Impact</h4>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Join thousands of volunteers making a difference in our community through 
            organized events and meaningful service opportunities.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Recognition & Growth</h4>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Earn certificates, track your volunteer hours, and build your service 
            portfolio while contributing to important causes.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Checklist</h4>
        <div className="space-y-3">
          {[
            'Complete your profile setup',
            'Browse available events',
            'Register for your first event',
            'Attend and participate actively',
            'Track your attendance',
            'Download your certificates'
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
              </div>
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GettingStartedSection;
