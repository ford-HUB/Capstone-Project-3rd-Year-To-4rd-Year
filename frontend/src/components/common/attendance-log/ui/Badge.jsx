const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-orange-100 text-orange-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      // Status variants
      present: 'bg-green-100 text-green-800',
      'in-progress': 'bg-orange-100 text-orange-800',
      'failed-to-attend': 'bg-red-100 text-red-800',
      // Event type variants
      school: 'bg-blue-100 text-blue-800',
      community: 'bg-purple-100 text-purple-800',
      others: 'bg-gray-100 text-gray-800',
      // Participant type variants
      volunteer: 'bg-blue-100 text-blue-800',
      staff: 'bg-green-100 text-green-800',
      coordinator: 'bg-purple-100 text-purple-800',
      assistant_coordinator: 'bg-purple-100 text-purple-800',
      director: 'bg-red-100 text-red-800',
      beneficiary: 'bg-orange-100 text-orange-800'
    };
    
    // If className contains color classes, use them instead of variant
    const hasColorClasses = className.includes('bg-') && className.includes('text-');
    const baseClasses = hasColorClasses ? '' : (variants[variant] || variants.default);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${baseClasses} ${className}`}>
        {children}
      </span>
    );
};

export default Badge;