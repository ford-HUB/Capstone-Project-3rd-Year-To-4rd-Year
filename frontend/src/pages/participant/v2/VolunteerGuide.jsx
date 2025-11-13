import React from 'react';
import { BookOpen } from 'lucide-react';
import VolunteerGuideSidebar from '../../../components/participant/v2/volunteer-guide/VolunteerGuideSidebar';
import VolunteerGuideContent from '../../../components/participant/v2/volunteer-guide/VolunteerGuideContent';
import '../../../styles/scrollbar.css'

const VolunteerGuide = () => {
  const [activeSection, setActiveSection] = React.useState('getting-started');

  return (
    <div className="bg-gray-50 h-min-screen py-8" >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Volunteer Guide</h1>
              <p className="text-gray-600">Your comprehensive guide to using the UCLM CARES system</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <VolunteerGuideSidebar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
          />

          <VolunteerGuideContent activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
};

export default VolunteerGuide;