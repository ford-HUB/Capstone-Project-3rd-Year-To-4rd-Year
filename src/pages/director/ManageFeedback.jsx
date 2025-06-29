import React from 'react';
import DirectorSidePanel from '../../components/director/DirectorSidePanel';
import { Search, Filter, Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const ManageFeedback = () => {
    // Temporary data for feedback
    const feedbackList = [
        {
            id: 1,
            event: "Community Outreach Program",
            participant: "John Doe",
            comment: "Great event! The organization was excellent and the impact was significant.",
            date: "May 28, 2024",
            sentiment: "positive"
        },
        {
            id: 2,
            event: "Health Awareness Seminar",
            participant: "Jane Smith",
            comment: "Very informative session. Learned a lot about health and wellness.",
            date: "May 25, 2024",
            sentiment: "positive"
        },
        {
            id: 3,
            event: "Youth Leadership Workshop",
            participant: "Mike Johnson",
            comment: "Good content but could use more interactive activities.",
            date: "May 20, 2024",
            sentiment: "neutral"
        }
    ];

    return (
        <div className="p-6 bg-gray-50 pt-24 pl-12 h-screen">
            <div className="flex flex-col md:flex-row gap-4 h-full">
                <DirectorSidePanel />
                
                {/* Main Content */}
                <div className="flex-1 ml-12 h-full">
                    {/* Header Section - Now Sticky */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 z-10">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Manage Feedback</h1>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search feedback..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                                    <Filter className="w-5 h-5" />
                                    Filter
                                </button>
                            </div>
                        </div>
                    </div>
                    

                    {/* Feedback List - Now Scrollable */}
                    <div className="mt-6 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
                        {feedbackList.map((feedback) => (
                            <div key={feedback.id} className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{feedback.event}</h3>
                                        <p className="text-sm text-gray-600">By {feedback.participant}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${
                                                        i < feedback.rating
                                                            ? 'text-yellow-400 fill-current'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm ${
                                            feedback.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {feedback.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-700 mb-4">{feedback.comment}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">{feedback.date}</span>
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1 text-green-600 hover:text-green-700">
                                            <ThumbsUp className="w-5 h-5" />
                                            <span>Approve</span>
                                        </button>
                                        <button className="flex items-center gap-1 text-red-600 hover:text-red-700">
                                            <ThumbsDown className="w-5 h-5" />
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageFeedback; 