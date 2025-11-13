import React from "react";
import TabButton from "../fields/TabButton";
import { User, Award, Gift, Clock, RotateCcwKey } from "lucide-react";

const NavigationTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
      { id: 'profile', icon: User, label: 'Profile' },
      { id: 'change-password', icon: RotateCcwKey, label: 'Change Password' },
      { id: 'certificates', icon: Award, label: 'Certificates' },
      { id: 'interest', icon: Gift, label: 'Event Interested' },
      { id: 'history', icon: Clock, label: 'Participation History' },
    ]
  
    return (
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              icon={tab.icon}
              text={tab.label}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>
    );
};

export default NavigationTabs;