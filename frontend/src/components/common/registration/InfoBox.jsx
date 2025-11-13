import React from "react";

const InfoBox = ({ type = "info", title, children, icon: Icon }) => {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    success: "bg-green-50 border-green-200 text-green-700"
  };

  return (
    <div className={`${styles[type]} border rounded-lg p-4`}>
      <div className="flex items-start">
        {Icon && <Icon className="h-5 w-5 mt-0.5 mr-3" />}
        <div className="text-sm">
          {title && <p className="font-medium mb-1">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
