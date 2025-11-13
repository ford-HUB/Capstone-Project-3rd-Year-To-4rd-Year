import { Award } from "lucide-react";

const EmptyState = () => (
    <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Award className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No certificate templates found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by creating your first certificate template. You can choose from various types including course certificates, awards, and participation certificates.
        </p>
        <Button variant="primary" size="lg">
            Create Your First Template
        </Button>
    </div>
);