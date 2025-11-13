import { Eye, Loader } from "lucide-react";
import StatusBadge from "../badge/StatusBadge.jsx";

const CertificatePreview = ({ config, templateName, status, isLoading, onPreview }) => {
    const IconComponent = config.icon;

    return (
        <div 
            className={`h-40 bg-gradient-to-br ${config.bgClass} flex items-center justify-center relative group cursor-pointer`}
            onClick={onPreview}
            role="button"
            tabIndex={0}
            aria-label={`Preview ${templateName} certificate template`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onPreview();
                }
            }}
        >
            <IconComponent className={`w-16 h-16 text-${config.color}-600 opacity-80`} />
            
            <div className="absolute inset-0 bg-black/50 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Quick Preview
                </span>
            </div>
            
            <div className="absolute top-2 right-2">
                <StatusBadge status={status} />
            </div>

            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                    <Loader className="w-6 h-6 animate-spin text-blue-600" />
                </div>
            )}
        </div>
    );
};

export default CertificatePreview