import React from 'react';
import { Eye, Check } from "lucide-react";
import { asset } from '../../../../assets/asset';

const TemplateCard = ({ 
  template, 
  index, 
  viewMode, 
  isSelected, 
  onSelect, 
  onPreview, 
  renderPreview 
}) => {
  const templateId = (template && template.id) || index;
  const templateName = typeof template === "object" ? template.name || `Template ${index + 1}` : `Template ${index + 1}`;
  const templateCategory = typeof template === "object" ? template.category || "general" : "general";
  const rawHtml = typeof template === "string" ? template : template.html || "";

  return (
    <div
      className={`
        group bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
        ${isSelected 
          ? "border-blue-500 ring-4 ring-blue-100 shadow-xl transform scale-101" 
          : "border-gray-200 hover:border-blue-300 hover:shadow-lg hover:transform hover:scale-102"
        }
        ${viewMode === "list" ? "flex items-center" : ""}
      `}
      onClick={onSelect}
    >
      {viewMode === "grid" ? (
        <GridView
          templateName={templateName}
          templateCategory={templateCategory}
          rawHtml={rawHtml}
          index={index}
          isSelected={isSelected}
          onPreview={onPreview}
          renderPreview={renderPreview}
        />
      ) : (
        <ListView
          templateName={templateName}
          templateCategory={templateCategory}
          rawHtml={rawHtml}
          index={index}
          isSelected={isSelected}
          onPreview={onPreview}
          renderPreview={renderPreview}
        />
      )}
    </div>
  );
};

const GridView = ({ templateName, templateCategory, rawHtml, index, isSelected, onPreview, renderPreview }) => (
  <>
    <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center p-2">
        {/* <iframe
          title={`certificate-preview-${index}`}
          srcDoc={renderPreview(rawHtml)}
          style={{ 
            width: "100%", 
            height: "100%", 
            border: "none", 
            display: "block",
            pointerEvents: "none",
            borderRadius: "4px"
          }}
        /> */}
        <img 
        src={asset.transparentLogo}
        alt=""
        className='h-[8rem] w-[8rem]'
        />
      </div>
      
      <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-3 bg-white text-blue-600 rounded-full shadow-lg hover:shadow-xl transform scale-90 hover:scale-100"
        >
          <Eye size={20} />
        </button>
      </div>

      {isSelected && (
        <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-2 shadow-lg">
          <Check size={16} />
        </div>
      )}
    </div>
    
    <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
        {templateName}
      </h3>
      <div className="flex items-center justify-between">
        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
          {templateCategory}
        </span>
        <span className="text-xs text-gray-500">Click to select</span>
      </div>
    </div>
  </>
);

const ListView = ({ templateName, templateCategory, rawHtml, index, isSelected, onPreview, renderPreview }) => (
  <>
    <div className="flex justify-center items-center w-32 h-20 bg-gray-50 rounded-lg overflow-hidden m-4 flex-shrink-0 border border-gray-200">
      {/* <iframe
        title={`certificate-preview-${index}`}
        srcDoc={renderPreview(rawHtml)}
        style={{ 
          width: "100%", 
          height: "100%",
          border: "none",
          pointerEvents: "none"
        }}
      /> */}
       <img 
        src={asset.transparentLogo}
        alt=""
        className='h-[4rem] w-[4rem]'
        />
    </div>
    
    <div className="flex-1 p-4">
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
        {templateName}
      </h3>
      <p className="text-sm text-gray-600 capitalize">Category: {templateCategory}</p>
      <p className="text-xs text-gray-500 mt-1">Click to select this template</p>
    </div>
    
    <div className="flex items-center gap-2 p-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Eye size={18} />
      </button>
      
      {isSelected && (
        <div className="bg-blue-600 text-white rounded-full p-2">
          <Check size={16} />
        </div>
      )}
    </div>
  </>
);

export default TemplateCard;