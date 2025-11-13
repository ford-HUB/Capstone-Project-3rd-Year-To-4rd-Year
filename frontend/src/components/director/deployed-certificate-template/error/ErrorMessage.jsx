

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    
    return (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{message}</p>
        </div>
    );
};

export default ErrorMessage