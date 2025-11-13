import React from "react";

const StepHeader = ({ title, description }) => (
  <div className="text-center mb-6">
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default StepHeader;
