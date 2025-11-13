import React from 'react';
import { 
  Home, 
  Calendar, 
  CheckCircle, 
  Award, 
  User, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

const VolunteerGuideSidebar = ({ activeSection, setActiveSection }) => {
  const guideSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Home className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'event-participation',
      title: 'Event Participation',
      icon: <Calendar className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: 'attendance-tracking',
      title: 'Attendance & Tracking',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'purple'
    },
    {
      id: 'certificates',
      title: 'Certificates & Recognition',
      icon: <Award className="w-5 h-5" />,
      color: 'amber'
    },
    {
      id: 'profile-management',
      title: 'Profile & Settings',
      icon: <User className="w-5 h-5" />,
      color: 'indigo'
    },
    {
      id: 'troubleshooting',
      title: 'Help & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      color: 'red'
    }
  ];

  return (
    <div className="lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guide Sections</h3>
        <nav className="space-y-2">
          {guideSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {section.icon}
              <span className="font-medium">{section.title}</span>
              {activeSection === section.id && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default VolunteerGuideSidebar;
