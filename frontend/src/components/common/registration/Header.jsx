import React from 'react';
import { LogIn, Heart } from 'lucide-react';
import { asset } from '../../../assets/asset';
import { NavLink } from 'react-router-dom';

const Header = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                    <img
                        className="w-10 h-10 flex items-center justify-center"
                        src={asset.transparentLogo}
                    />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            UCLM CARES
                        </h1>
                        <p className="text-xs text-gray-500">
                            Volunteer Registration
                        </p>
                    </div>
                </div>
                <NavLink
                    to={`/`}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                </NavLink>
            </div>
        </div>
    </nav>
);

export default Header;
