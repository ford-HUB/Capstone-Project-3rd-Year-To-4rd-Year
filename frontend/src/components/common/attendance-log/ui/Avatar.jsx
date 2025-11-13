
const Avatar = ({ initials, bgColor, size = 'md' }) => {
    const sizes = {
      sm: 'w-6 h-6 text-xs',
      md: 'w-8 h-8 text-xs',
      lg: 'w-10 h-10 text-sm'
    };
    
    return (
      <div className={`${bgColor} rounded-full flex items-center justify-center text-white font-medium ${sizes[size]}`}>
        {initials}
      </div>
    );
};

export default Avatar