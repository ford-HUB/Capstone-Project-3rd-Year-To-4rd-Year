import React from 'react';
import BeneficiaryNavbar from '../components/beneficiary/v2/BeneficiaryNavbar';
import { Outlet } from 'react-router-dom';

const BeneficiaryLayout = () => {
    return (
        <div className='flex h-screen overflow-hidden'>
            <div className="flex flex-col overflow-hidden w-full">
                <BeneficiaryNavbar />

                <main className="flex-1 overflow-y-hidden bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default BeneficiaryLayout;
