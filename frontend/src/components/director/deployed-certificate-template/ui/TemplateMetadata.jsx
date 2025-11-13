import { User, Calendar } from "lucide-react";
import { formatDate, formatRelativeTime } from "../../../../utils/deployedCertificateTemplatesUtils.js";

const TemplateMetadata = ({ usageCount, createdDate, lastModified }) => (
    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-4">
            {/* <div className="flex items-center gap-1" title={`${usageCount} certificates issued`}>
                <User className="w-4 h-4" />
                <span>{usageCount} issued</span>
            </div> */}
            <div className="flex items-center gap-1" title={`Created on ${formatDate(createdDate)}`}>
                <Calendar className="w-4 h-4" />
                <span>{formatDate(createdDate)}</span>
            </div>
        </div>
        {lastModified && (
            <span 
                className="text-xs text-gray-400"
                title={`Last modified on ${formatDate(lastModified)}`}
            >
                Updated {formatRelativeTime(lastModified)}
            </span>
        )}
    </div>
);

export default TemplateMetadata