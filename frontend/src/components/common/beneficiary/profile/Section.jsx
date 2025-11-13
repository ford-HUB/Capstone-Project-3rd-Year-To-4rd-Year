import React from "react";
import { HelpCircle } from "lucide-react";

const Section = ({ title, children, helpIcon = false }) => (
    <div className="mb-8">
      <div className={`flex items-center ${helpIcon ? 'space-x-2' : ''} mb-6`}>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {helpIcon && <HelpCircle className="w-4 h-4 text-gray-400" />}
      </div>
      {children}
    </div>
);

export default Section;
