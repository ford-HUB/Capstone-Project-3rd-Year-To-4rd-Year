import React, { useEffect } from 'react';
import { Star, CheckCircle, User, Building2, ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { useAllTestimonialsStore } from '../../store/director/useAllTestimonialsStore';

const AllTestimonials = () => {
    const { 
        testimonials, 
        pagination, 
        isLoading, 
        isToggling,
        getAllApprovedTestimonials, 
        toggleFeatured
    } = useAllTestimonialsStore();

    useEffect(() => {
        getAllApprovedTestimonials(1, 10);
    }, [getAllApprovedTestimonials]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            getAllApprovedTestimonials(newPage, 10);
        }
    };

    const handleToggleFeatured = async (testimonialId, currentFeatured) => {
        await toggleFeatured(testimonialId, !currentFeatured);
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
                            <h1 className="text-2xl font-bold text-gray-800">All Testimonial Records</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage and feature approved testimonials
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">
                                {pagination.totalItems} approved
                            </span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-20">
                            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Testimonials</h3>
                            <p className="text-gray-600">There are no approved testimonials yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {testimonials.map((testimonial) => (
                                    <div
                                        key={testimonial.testimonial_id}
                                        className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow border p-6 ${
                                            testimonial.featured 
                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-white' 
                                                : 'border-gray-200'
                                        }`}
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
                                            {testimonial.featured && (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                                    <Sparkles className="w-3 h-3" />
                                                    Featured
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center gap-1 mb-2">
                                                {renderStars(testimonial.rating)}
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-4">
                                                {testimonial.message}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(testimonial.createdAt)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                                    <span>Featured</span>
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={testimonial.featured}
                                                            onChange={() => handleToggleFeatured(testimonial.testimonial_id, testimonial.featured)}
                                                            disabled={isToggling === testimonial.testimonial_id}
                                                            className="sr-only"
                                                        />
                                                        <div
                                                            className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                                                testimonial.featured
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-gray-300'
                                                            } ${isToggling === testimonial.testimonial_id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                            onClick={() => {
                                                                if (isToggling !== testimonial.testimonial_id) {
                                                                    handleToggleFeatured(testimonial.testimonial_id, testimonial.featured);
                                                                }
                                                            }}
                                                        >
                                                            <div
                                                                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out mt-0.5 ${
                                                                    testimonial.featured
                                                                        ? 'translate-x-5'
                                                                        : 'translate-x-0.5'
                                                                }`}
                                                            />
                                                        </div>
                                                    </div>
                                                </label>
                                                {isToggling === testimonial.testimonial_id && (
                                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                )}
                                            </div>
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

export default AllTestimonials;

