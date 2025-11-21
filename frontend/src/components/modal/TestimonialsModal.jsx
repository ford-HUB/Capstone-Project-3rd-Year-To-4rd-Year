import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTestimonialStore } from '../../store/guest/useTestimonialStore';
import { TESTIMONIAL_COLOR_CLASSES } from '../../constants';
import { getBeneficiaryName, getBeneficiaryInitials, renderStars } from '../../utils/testimonialUtils';

const TestimonialsModal = ({ isOpen, onClose }) => {
  const { 
    allTestimonials, 
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

