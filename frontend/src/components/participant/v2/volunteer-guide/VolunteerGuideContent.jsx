import React from 'react';
import GettingStartedSection from './sections/GettingStartedSection.jsx';
import EventParticipationSection from './sections/EventParticipationSection.jsx';
import AttendanceTrackingSection from './sections/AttendanceTrackingSection.jsx';
import CertificatesSection from './sections/CertificatesSection.jsx';
import ProfileManagementSection from './sections/ProfileManagementSection.jsx';
import TroubleshootingSection from './sections/TroubleshootingSection.jsx';
import '../../../../styles/scrollbar.css'

const VolunteerGuideContent = ({ activeSection }) => {
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return <GettingStartedSection />;
      case 'event-participation':
        return <EventParticipationSection />;
      case 'attendance-tracking':
        return <AttendanceTrackingSection />;
      case 'certificates':
        return <CertificatesSection />;
      case 'profile-management':
        return <ProfileManagementSection />;
      case 'troubleshooting':
        return <TroubleshootingSection />;
      default:
        return <GettingStartedSection />;
    }
  };

  return (
    <div className="flex-1 px-4 overflow-y-auto max-h-screen pb-[16rem] scrollbar-hide">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 overflow-y-auto scrollbar-hide">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default VolunteerGuideContent;
