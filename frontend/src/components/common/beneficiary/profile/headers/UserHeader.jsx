import React from "react";
import { User } from "lucide-react";

const UserHeader = ({ userData }) => (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="text-white">
        <div className="text-lg mb-2">Welcome,</div>
        <div className="text-3xl font-bold mb-2">{`${userData?.firstname?.toUpperCase() || 'BENEFICIARY'} ${userData?.lastname?.toUpperCase() || 'USER'}`}</div>
        <div className="flex items-center space-x-2 text-sm opacity-90">
          <span>Beneficiary</span>
          <span>•</span>
          <span>{userData?.organization_name ? 'Organization' : 'Individual'}</span>
        </div>
      </div>
    </div>
);

export default UserHeader;


