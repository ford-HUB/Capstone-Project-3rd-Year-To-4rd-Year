import React, { useEffect } from 'react';
import { Star, CheckCircle, Clock, User, Building2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { usePendingTestimonialsStore } from '../../store/director/usePendingTestimonialsStore';

const PendingTestimonials = () => {
    const { 
        testimonials, 
        pagination, 
        isLoading, 
        isApproving,
        getPendingTestimonials, 
        approveTestimonial 
    } = usePendingTestimonialsStore();

    useEffect(() => {
        getPendingTestimonials(1, 10);
    }, [getPendingTestimonials]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            getPendingTestimonials(newPage, 10);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getBeneficiaryName = (beneficiary) => {
        if (!beneficiary) return 'Unknown';
        const { firstname, lastname, middle_initial } = beneficiary;
        return `${firstname} ${middle_initial ? middle_initial + '. ' : ''}${lastname}`.trim();
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={18}
                className={index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
        ));
    };

    return (
        <div className="p-6 h-screen bg-gray-50 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Pending Testimonials</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Review and approve testimonials submitted by beneficiaries
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">
                                {pagination.totalItems} pending
                            </span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-20">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
                            <p className="text-gray-600">There are no pending testimonials to review.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {testimonials.map((testimonial) => (
                                    <div
                                        key={testimonial.testimonial_id}
                                        className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {getBeneficiaryName(testimonial.Beneficiary)}
                                                    </p>
                                                    {testimonial.Beneficiary?.organization_name && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                            <Building2 className="w-3 h-3" />
                                                            <span>{testimonial.Beneficiary.organization_name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                                Pending
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center gap-1 mb-2">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-4">
                                                {testimonial.message}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <span className="text-xs text-gray-500">
                                                {formatDate(testimonial.createdAt)}
                                            </span>
                                            <button
                                                onClick={() => approveTestimonial(testimonial.testimonial_id)}
                                                disabled={isApproving === testimonial.testimonial_id}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                            >
                                                {isApproving === testimonial.testimonial_id ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Approving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        Approve
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                    <div className="text-sm text-gray-600">
                                        Showing page {pagination.currentPage} of {pagination.totalPages} 
                                        {' '}({pagination.totalItems} total testimonials)
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: pagination.totalPages }, (_, index) => {
                                                const page = index + 1;
                                                // Show first page, last page, current page, and pages around current
                                                if (
                                                    page === 1 ||
                                                    page === pagination.totalPages ||
                                                    (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => handlePageChange(page)}
                                                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                                                page === pagination.currentPage
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                } else if (
                                                    page === pagination.currentPage - 2 ||
                                                    page === pagination.currentPage + 2
                                                ) {
                                                    return <span key={page} className="px-2">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingTestimonials;

