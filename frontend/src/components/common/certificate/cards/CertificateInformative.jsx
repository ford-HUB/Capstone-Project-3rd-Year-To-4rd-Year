import React from 'react';
import { Award, Calendar, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';

const CertificateInformative = ({ certificateData }) => {
    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between px-2 pt-4 pb-3">
                <h4 className="text-xl font-semibold text-gray-800">
                    Latest Achievements
                </h4>
                {certificateData?.length > 0 ? (
                    <NavLink to={`/participant/profile?tab=certificates`} className="flex justify-end items-center pr-4 py-2">
                        <span className="text-[12px] text-green-600 underline cursor-pointer">
                            Show All
                        </span>
                    </NavLink>
                ) : (
                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Action Required
                    </div>
                )}

            </div>


            {certificateData?.length > 0 ? (
                <div
                    className={`relative overflow-hidden rounded-xl bg-gray-50 transition-all duration-300 `}>
                    <div className="absolute top-0 right-0 w-16 h-12 opacity-5">
                        <Award className="w-full h-full text-blue-600 transform rotate-12" />
                    </div>

                    <div className="flex justify-start p-4 space-x-2">
                        <div className="w-18 h-12 border-2 border-green-400 rounded flex items-center justify-center bg-white">
                            <svg
                                width="48"
                                height="38"
                                viewBox="0 0 48 38"
                                fill="none"
                                className="text-green-500">
                                <rect
                                    x="4"
                                    y="8"
                                    width="36"
                                    height="24"
                                    rx="1"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                                <path
                                    d="M8 16 L12 20 L16 16"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                                <line
                                    x1="22"
                                    y1="14"
                                    x2="34"
                                    y2="14"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                                <line
                                    x1="22"
                                    y1="18"
                                    x2="34"
                                    y2="18"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                                <line
                                    x1="22"
                                    y1="22"
                                    x2="30"
                                    y2="22"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                            </svg>
                        </div>
                        <div className="flex-col items-center">
                            {certificateData.slice(0, 3).map((data) => (
                                <>
                                    <div className="font-semibold">
                                        {data.title}
                                    </div>
                                    <span className="text-sm">
                                        {dayjs(data.issued_at).format(
                                            'MMM DD, YYYY'
                                        )}
                                    </span>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className={`relative overflow-hidden border border-dashed rounded-xl transition-all duration-300 border-blue-400 bg-gradient-to-br from-blue-50 to-white transform scale-[1.02]`}>
                        <div className="absolute top-0 right-0 w-16 h-12 opacity-5">
                            <Award className="w-full h-full text-blue-600 transform rotate-12" />
                        </div>

                        <div className="relative z-10 p-2">
                            <div className="flex items-center justify-center space-x-3">
                                <div
                                    className={`p-2 rounded-full transition-all duration-300 bg-blue-100`}>
                                    <Award
                                        className={`h-8 w-8 transition-colors duration-300 text-blue-600 text-gray-500'`}
                                    />
                                </div>
                                <div className="text-center">
                                    <span className="text-lg font-medium text-gray-700">
                                        No Achievements Yet
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center p-0.5 items-center">
                        <NavLink
                            to={`/participant/profile?tab=certificates`}
                            className="text-[12px] hover:text-blue-800 text-blue-600 transition-colors duration-300 underline">
                            You may visit the page
                        </NavLink>
                    </div>

                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-2 mt-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                                <Calendar className="h-4 w-4" />
                                <span>To Get Your Certificate:</span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-amber-700">
                                            1
                                        </span>
                                    </div>
                                    <p className="text-sm text-amber-700 leading-relaxed">
                                        Attend an upcoming event
                                    </p>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Users className="w-3 h-3 text-amber-700" />
                                    </div>
                                    <p className="text-sm text-amber-700 leading-relaxed">
                                        Complete attendance computation
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CertificateInformative;
