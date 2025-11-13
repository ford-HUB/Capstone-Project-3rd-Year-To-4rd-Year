import React from 'react';
import ParticpantNavbar from '../components/participant/v2/ParticpantNavbar';
import { Outlet } from 'react-router-dom';

const VolunteerLayout = () => {
    return (
        <div className='flex h-screen overflow-hidden'>
            <div className="flex flex-col overflow-hidden w-full">
                <ParticpantNavbar />

                <main className="flex-1 overflow-y-hidden bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default VolunteerLayout;
