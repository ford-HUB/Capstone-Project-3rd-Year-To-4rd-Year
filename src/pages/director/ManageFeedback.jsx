import React from 'react';
import DirectorSidePanel from '../../components/director/DirectorSidePanel';
import { Search, Filter, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

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
        <div className="p-6 bg-gray-50 pt-24 pl-12">
            <div className="flex flex-col md:flex-row gap-4">
                <DirectorSidePanel />
                
                {/* Main Content */}
                <div className="flex-1 ml-12">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
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

                        {/* Feedback List */}
                        <div className="space-y-4">
                            {feedbackList.map((feedback) => (
                                <div key={feedback.id} className="bg-gray-100 rounded-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{feedback.event}</h3>
                                            <p className="text-sm text-gray-600">By {feedback.participant}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mb-4">{feedback.comment}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{feedback.date}</span>
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageFeedback; 