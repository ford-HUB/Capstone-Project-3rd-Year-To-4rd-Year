
const StatusBadge = ({ status }) => (
    <span 
        className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm flex items-center gap-1 ${
            status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
        }`}
        aria-label={`Template status: ${status}`}
    >
        <span 
            className={`w-2 h-2 rounded-full ${
                status === 'active' ? 'bg-green-200' : 'bg-gray-300'
            }`}
            aria-hidden="true"
        />
        {status === 'active' ? 'Active' : 'Draft'}
    </span>
);

export default StatusBadge