import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTestimonialStore } from '../../store/guest/useTestimonialStore';
import { TESTIMONIAL_COLOR_CLASSES } from '../../constants';
import { getBeneficiaryName, getBeneficiaryInitials, renderStars } from '../../utils/testimonialUtils';

const TestimonialsModal = ({ isOpen, onClose }) => {
  const { 
    allTestimonials, 
    statistics, 
    isLoading, 
    getTestimonialsStatistics 
  } = useTestimonialStore();

  useEffect(() => {
    if (isOpen) {
      getTestimonialsStatistics();
    }
  }, [isOpen, getTestimonialsStatistics]);



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">What People Say About Us</h2>
                  <p className="text-blue-100 text-sm">Discover how UCLM CARES has made a positive impact</p>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto flex-1 p-6">
                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Overall Rating */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3">
                        <svg className="w-12 h-12 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <span className="text-4xl font-bold mr-2">{statistics.averageRating || 0}</span>
                          <div className="flex text-yellow-300 text-lg">
                            <span>★</span>
                            <span>★</span>
                            <span>★</span>
                            <span>★</span>
                            <span>★</span>
                          </div>
                        </div>
                        <p className="text-blue-100 text-base font-medium">Overall Rating</p>
                        <p className="text-blue-200 text-xs mt-1">Based on {statistics.totalCount || 0} {statistics.totalCount === 1 ? 'review' : 'reviews'}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Beneficiary Count */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-3">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <div className="mb-1">
                          <span className="text-4xl font-bold">{statistics.beneficiariesServed || 0}+</span>
                        </div>
                        <p className="text-green-100 text-base font-medium">Beneficiaries Served</p>
                        <p className="text-green-200 text-xs mt-1">Across multiple communities</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Testimonials Grid */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : allTestimonials.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-gray-600">No testimonials available yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allTestimonials.map((testimonial, index) => (
                      <motion.div
                        key={testimonial.testimonial_id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                      >
                        <div className="flex items-center mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4 text-sm leading-relaxed italic">
                          "{testimonial.message}"
                        </p>
                        <div className="flex items-center">
                          <div className={`w-10 h-10 ${TESTIMONIAL_COLOR_CLASSES[index % TESTIMONIAL_COLOR_CLASSES.length]} rounded-full flex items-center justify-center mr-3`}>
                            <span className="font-bold text-sm">{getBeneficiaryInitials(testimonial.Beneficiary)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{getBeneficiaryName(testimonial.Beneficiary)}</h4>
                            <p className="text-xs text-gray-600">
                              {testimonial.Beneficiary?.organization_name || 'Beneficiary'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TestimonialsModal;

