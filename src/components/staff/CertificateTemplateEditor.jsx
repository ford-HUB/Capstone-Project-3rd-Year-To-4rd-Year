import React, { useState } from 'react';
import { X, Save, Image, Type, Move } from 'lucide-react';

const CertificateTemplateEditor = ({ onClose }) => {
  const [templateData] = useState({
    title: 'Event Participation Certificate',
    orientation: 'landscape',
    size: 'A4',
    elements: [
      { id: 1, type: 'text', content: '[Participant Name]', x: 50, y: 30, fontSize: 24, isBold: true },
      { id: 2, type: 'text', content: 'has successfully participated in', x: 50, y: 40, fontSize: 16 },
      { id: 3, type: 'text', content: '[Event Name]', x: 50, y: 50, fontSize: 20, isBold: true },
      { id: 4, type: 'text', content: 'on', x: 50, y: 60, fontSize: 16 },
      { id: 5, type: 'text', content: '[Event Date]', x: 50, y: 70, fontSize: 16 },
      { id: 6, type: 'signature', content: '[Organizer Signature]', x: 30, y: 85, width: 200 },
      { id: 7, type: 'signature', content: '[Dean Signature]', x: 70, y: 85, width: 200 },
    ]
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Certificate Template</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex">
          {/* Left Sidebar - Tools */}
          <div className="w-64 border-r p-4 space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium">Template Settings</h3>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={templateData.title}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Size</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>A4</option>
                  <option>Letter</option>
                  <option>Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Orientation</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Landscape</option>
                  <option>Portrait</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Add Elements</h3>
              <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 border">
                <Type size={20} />
                <span>Add Text</span>
              </button>
              <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 border">
                <Image size={20} />
                <span>Add Image</span>
              </button>
              <button className="w-full p-3 text-left rounded-lg hover:bg-gray-50 flex items-center gap-3 border">
                <Move size={20} />
                <span>Add Signature Field</span>
              </button>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 p-6 bg-gray-50 overflow-auto">
            <div className="bg-white w-[842px] h-[595px] mx-auto shadow-lg relative p-8">
              {/* Template Preview */}
              <div className="border-2 border-dashed border-gray-200 w-full h-full rounded-lg flex items-center justify-center">
                {templateData.elements.map((element) => (
                  <div
                    key={element.id}
                    className="absolute cursor-move p-2 hover:bg-blue-50 rounded border border-transparent hover:border-blue-200"
                    style={{ left: `${element.x}%`, top: `${element.y}%` }}
                  >
                    {element.type === 'text' && (
                      <p style={{ 
                        fontSize: `${element.fontSize}px`,
                        fontWeight: element.isBold ? 'bold' : 'normal'
                      }}>
                        {element.content}
                      </p>
                    )}
                    {element.type === 'signature' && (
                      <div className="border-b border-gray-300 w-48">
                        <p className="text-sm text-gray-500 text-center">{element.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Element Properties */}
          <div className="w-64 border-l p-4">
            <h3 className="font-medium mb-4">Element Properties</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Content</label>
                <input type="text" className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Font Size</label>
                <input type="number" className="w-full p-2 border rounded-lg" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="bold" />
                <label htmlFor="bold" className="text-sm text-gray-600">Bold</label>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Position X (%)</label>
                <input type="number" className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Position Y (%)</label>
                <input type="number" className="w-full p-2 border rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save size={20} />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplateEditor; 