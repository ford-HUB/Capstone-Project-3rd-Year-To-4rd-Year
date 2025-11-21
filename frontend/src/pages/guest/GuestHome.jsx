import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { asset } from '../../assets/asset';
import TestimonialsModal from '../../components/modal/TestimonialsModal';
import { useTestimonialStore } from '../../store/guest/useTestimonialStore';
import { TESTIMONIAL_COLOR_CLASSES } from '../../constants';
import { getBeneficiaryName, getBeneficiaryInitials, renderStars } from '../../utils/testimonialUtils';

const GuestHome = () => {
  const carouselImages = [
    { src: asset.groupImage, alt: 'UCLM CARES Group' },
    { src: asset.impactPic1, alt: 'Community Impact' },
    { src: asset.impactPic2, alt: 'Community Programs' },
    { src: asset.impactPic3, alt: 'Extension Services' },
    { src: asset.cleanupDrive, alt: 'Community Activities' },
    { src: asset.brg, alt: 'Barangay Activities' },
  ].filter(img => img.src); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isTestimonialsModalOpen, setIsTestimonialsModalOpen] = useState(false);
  
  const { 
    featuredTestimonials, 
    statistics, 
    isLoading, 
    getFeaturedTestimonials, 
    getTestimonialsStatistics 
  } = useTestimonialStore();

  // Auto-play carousel
  useEffect(() => {
    setIsInitialLoad(false);
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  useEffect(() => {
    if (isTestimonialsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isTestimonialsModalOpen]);

  useEffect(() => {
    getFeaturedTestimonials();
    getTestimonialsStatistics();
  }, [getFeaturedTestimonials, getTestimonialsStatistics]);

  const fadeVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };



  return (
    <div className="min-h-screen">
      <div className="homeContainer flex h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-gray-50">
        <motion.div 
          className="absolute inset-0 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.1),transparent_50%)]" />
        </motion.div>

        <motion.div 
          className="backgroundContainer absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src={asset.backgroundV2}
            alt="UCLM Cover"
            className="object-cover h-full w-full opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-transparent" />
        </motion.div>

        <div className="content flex flex-col lg:flex-row justify-between items-center w-full h-full relative px-6 md:px-12 lg:px-16 z-10 gap-6 lg:gap-12">
          <motion.div 
            className="leftContent relative text-left max-w-2xl flex-shrink-0 w-full lg:w-auto"
            initial={{ opacity: 0, x: -80, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Community Extension Services
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-tight text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Welcome to{' '}
              <motion.span 
                className="text-blue-600 relative inline-block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7, type: "spring" }}
              >
                UCLM
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                />
              </motion.span>
              <br />
              <span className="text-gray-700">Community Awareness,</span>
              <br />
              <span className="text-gray-700">Relations & Extension Services</span>
            </motion.h1>
            
            <motion.div 
              className="flex items-center gap-4 mt-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <motion.div
                className="inline-flex items-center bg-white/60 rounded-full shadow-lg backdrop-blur-md border border-gray-200"
                whileHover={{ scale: 1.1, rotate: 5, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <img 
                  className="w-16 h-16 object-contain" 
                  src={asset.uclmLogo} 
                  alt="UCLM Logo" 
                />
              </motion.div>
              <motion.div
                className="inline-flex items-center bg-white/60 rounded-full shadow-lg backdrop-blur-md border border-gray-200"
                whileHover={{ scale: 1.1, rotate: -5, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <img 
                  className="w-16 h-16 object-contain" 
                  src={asset.logo} 
                  alt="UC CARES Logo" 
                />
              </motion.div>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              Empowering communities through awareness, building relationships, and providing meaningful extension services that create lasting positive impact.
            </motion.p>

            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(37, 99, 235, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Learn More
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-lg border-2 border-blue-600"
                whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Get Involved
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="rightContent relative w-full lg:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-lg" style={{ height: '500px' }}>
              {/* Carousel Container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-md border border-white/20" style={{ minHeight: '500px' }}>
                {carouselImages.length > 0 && (
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={currentIndex}
                      variants={fadeVariants}
                      initial={isInitialLoad ? "center" : "enter"}
                      animate="center"
                      exit="exit"
                      transition={{
                        opacity: { duration: 1.5, ease: "easeInOut" },
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <img
                        src={carouselImages[currentIndex]?.src || asset.groupImage}
                        alt={carouselImages[currentIndex]?.alt || 'UCLM CARES'}
                        className="w-full h-full object-cover"
                        style={{ minHeight: '500px', display: 'block' }}
                        loading="eager"
                        onLoad={() => {
                          if (isInitialLoad) {
                            setIsInitialLoad(false);
                          }
                        }}
                        onError={(e) => {
                          console.error('Image failed to load:', carouselImages[currentIndex]?.src);
                          // Fallback to group image
                          if (e.target.src !== asset.groupImage) {
                            e.target.src = asset.groupImage;
                          }
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Image Counter */}
                <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  {currentIndex + 1} / {carouselImages.length}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-white py-16 overflow-hidden relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-black text-center mb-2">
            UCLM CARES Partners
          </h2>
          <p className="text-gray-600 text-center text-sm">Our trusted community partners</p>
        </div>
        
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-12 items-center"
            animate={{
              x: ['0%', '-50%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            style={{
              width: 'fit-content',
            }}
          >
            {[
              asset.one,
              asset.two,
              asset.three,
              asset.four,
              asset.five,
              asset.six,
              asset.seven,
              asset.eight,
              asset.nine,
              asset.ten,
              asset.eleven,
              asset.twelve,
            ].map((imgSrc, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 w-48 h-32 flex items-center justify-center px-4"
              >
                <img
                  src={imgSrc}
                  alt={`Partner ${index + 1}`}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 opacity-80 hover:opacity-100"
                />
              </div>
            ))}
            
            {[
              asset.one,
              asset.two,
              asset.three,
              asset.four,
              asset.five,
              asset.six,
              asset.seven,
              asset.eight,
              asset.nine,
              asset.ten,
              asset.eleven,
              asset.twelve,
            ].map((imgSrc, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 w-48 h-32 flex items-center justify-center px-4"
              >
                <img
                  src={imgSrc}
                  alt={`Partner ${index + 1}`}
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110 opacity-80 hover:opacity-100"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Testimonials Section - Footer */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              What People Say
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from our community members, partners, and beneficiaries about their experiences with UCLM CARES
            </p>
          </motion.div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
            {/* Overall Star Rating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
                    <span className="text-4xl font-bold">2,500+</span>
                  </div>
                  <p className="text-green-100 text-base font-medium">Beneficiaries Served</p>
                  <p className="text-green-200 text-xs mt-1">Across multiple communities</p>
                </div>
              </div>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredTestimonials.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No featured testimonials available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTestimonials.slice(0, 6).map((testimonial, index) => (
                <motion.div
                  key={testimonial.testimonial_id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
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

          {/* Show More Button */}
          <div className="flex justify-center mt-8">
            <motion.button
              onClick={() => setIsTestimonialsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition-colors duration-300 flex items-center gap-2"
            >
              <span>View All Testimonials</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={asset.logo} 
                  alt="UCLM CARES Logo" 
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-2xl font-bold">UCLM CARES</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Community Awareness, Relations, and Extension Services. Empowering communities through awareness, relationships, and meaningful extension services.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <img 
                  src={asset.uclmLogo} 
                  alt="UCLM Logo" 
                  className="w-8 h-8 object-contain opacity-80"
                />
                <span className="text-gray-400 text-xs">University of Cebu Lapu-Lapu and Mandaue</span>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Lapu-Lapu City, Cebu, Philippines</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@uclmcares.online</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+63 091 9011 0935</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4 mb-6">
                <motion.a
                  href="https://www.facebook.com/uclmcares"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <img src={asset.facebookWB} alt="Facebook" className="w-6 h-6 object-contain" />
                </motion.a>
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-2">Get Involved</h5>
                <p className="text-gray-300 text-xs mb-3">
                  Join us in making a difference in our communities.
                </p>
                <motion.button
                  onClick={() => window.location.href = '/'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  Volunteer Now
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Copyright Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} UCLM CARES. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-600">|</span>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-600">|</span>
              <a href="/data-deletion" className="hover:text-white transition-colors">
                Data Deletion
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Testimonials Modal */}
      <TestimonialsModal 
        isOpen={isTestimonialsModalOpen} 
        onClose={() => setIsTestimonialsModalOpen(false)} 
      />
    </div>
  );
};

export default GuestHome;
