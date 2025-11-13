import React from "react";
import { Heart } from "lucide-react";

const EmptyState = () => (
    <div className="text-center py-12">
      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-500 mb-2">No interests selected yet</h3>
      <p className="text-gray-400">Click on the volunteer activities that interest you to get started!</p>
    </div>
);

export default EmptyState