import React, { useState, useEffect } from 'react';
import { X, Star, User, Calendar, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useEvaluationStore } from '../../../../store/common/useEvaluationStore.js';

const EvaluationSubmissionsModal = ({ isOpen, onClose, event, allEvaluations = false }) => {
    const { getEvaluationsByEvent, getAllEvaluations, loading } = useEvaluationStore();
    const [evaluations, setEvaluations] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const fetchEvaluations = async () => {
                let data;
                if (allEvaluations) {
                    // Show all evaluations for the default form
                    data = await getAllEvaluations();
                } else if (event?.event_id) {
                    // Show evaluations for a specific event
                    data = await getEvaluationsByEvent(event.event_id);
                }
                setEvaluations(data || []);
            };
            fetchEvaluations();
        }
    }, [isOpen, event?.event_id, allEvaluations, getEvaluationsByEvent, getAllEvaluations]);

    if (!isOpen) return null;

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
            />
        ));
    };

    const getRecommendationColor = (recommendation) => {
        switch (recommendation) {
            case 'Definitely':
            case 'Probably':
                return 'text-green-600 bg-green-100';
            case 'Maybe':
                return 'text-yellow-600 bg-yellow-100';
            case 'Probably Not':
            case 'Definitely Not':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getParticipationColor = (participation) => {
        switch (participation) {
            case 'Yes, definitely':
            case 'Yes, probably':
                return 'text-green-600 bg-green-100';
            case 'Maybe':
                return 'text-yellow-600 bg-yellow-100';
            case 'Probably not':
            case 'No':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {allEvaluations ? "All Event Evaluations" : "Event Evaluation Submissions"}
                            </h2>
                            <p className="text-blue-100 mt-1">
                                {allEvaluations 
                                    ? "Default Evaluation Form - All Submissions" 
                                    : `${event?.title} - Default Evaluation Form`
                                }
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading evaluations...</span>
                        </div>
                    ) : evaluations.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No evaluations submitted</h3>
                            <p className="text-gray-600">No volunteers have submitted evaluations for this event yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {evaluations.map((evaluation, index) => (
                                <div key={evaluation.event_evaluation_id} className="bg-gray-50 rounded-lg p-6">
                                    {/* Volunteer Info */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    {evaluation.Volunteer?.CampusUser?.firstname || ''} {evaluation.Volunteer?.CampusUser?.lastname || ''}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {evaluation.Volunteer?.CampusUser?.Account?.email || evaluation.Volunteer?.CampusUser?.email || ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(evaluation.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ratings */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Overall Rating</label>
                                                <div className="flex items-center mt-1">
                                                    {renderStars(evaluation.overall_rating)}
                                                    <span className="ml-2 text-sm text-gray-600">({evaluation.overall_rating}/5)</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Content Quality</label>
                                                <div className="flex items-center mt-1">
                                                    {renderStars(evaluation.content_quality)}
                                                    <span className="ml-2 text-sm text-gray-600">({evaluation.content_quality}/5)</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Organization</label>
                                                <div className="flex items-center mt-1">
                                                    {renderStars(evaluation.organization_rating)}
                                                    <span className="ml-2 text-sm text-gray-600">({evaluation.organization_rating}/5)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Venue Rating</label>
                                                <div className="flex items-center mt-1">
                                                    {renderStars(evaluation.venue_rating)}
                                                    <span className="ml-2 text-sm text-gray-600">({evaluation.venue_rating}/5)</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Guidance & Support</label>
                                                <div className="flex items-center mt-1">
                                                    {renderStars(evaluation.gs_rating)}
                                                    <span className="ml-2 text-sm text-gray-600">({evaluation.gs_rating}/5)</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Communication</label>
                                                <div className="flex items-center mt-1">
                                                    {renderStars(evaluation.communication_rating)}
                                                    <span className="ml-2 text-sm text-gray-600">({evaluation.communication_rating}/5)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feedback */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                                    <ThumbsUp className="w-4 h-4 mr-1 text-green-600" />
                                                    Most Valuable
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                                                    {evaluation.most_valuable || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 flex items-center">
                                                    <ThumbsDown className="w-4 h-4 mr-1 text-red-600" />
                                                    Least Valuable
                                                </label>
                                                <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                                                    {evaluation.least_valuable || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Suggestions</label>
                                            <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                                                {evaluation.suggestions || 'N/A'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Additional Comments</label>
                                            <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                                                {evaluation.additional_comments || 'N/A'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Future Topics</label>
                                            <p className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border">
                                                {evaluation.futureTopics || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Recommendations */}
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 mr-2">Recommend Event:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(evaluation.recommendEvent)}`}>
                                                {evaluation.recommendEvent}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-700 mr-2">Future Participation:</span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getParticipationColor(evaluation.future_participation)}`}>
                                                {evaluation.future_participation}
                                            </span>
                                        </div>
                                        {evaluation.agree_share_testimonial && (
                                            <div className="flex items-center">
                                                <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
                                                    ✓ Agrees to share testimonial
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvaluationSubmissionsModal;
