import { useState, useRef } from 'react';
import { 
  Type, 
  Image, 
  Square, 
  Circle, 
  Text, 
  Move, 
  Plus, 
  Minus, 
  RotateCcw, 
  Save,
  Download,
  Palette,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

const CertificateEditor = () => {
  const [elements, setElements] = useState([
    {
      id: 1,
      type: 'text',
      content: 'Certificate of Achievement',
      x: 400,
      y: 100,
      fontSize: 36,
      fontFamily: 'Arial',
      color: '#000000',
      bold: true,
      italic: false,
      underline: false,
      align: 'center',
      rotation: 0,
    },
    {
      id: 2,
      type: 'text',
      content: 'This certifies that',
      x: 400,
      y: 180,
      fontSize: 24,
      fontFamily: 'Times New Roman',
      color: '#333333',
      bold: false,
      italic: true,
      underline: false,
      align: 'center',
      rotation: 0,
    }
  ]);

  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const [availableFonts] = useState([
    'Arial',
    'Times New Roman',
    'Helvetica',
    'Georgia',
    'Verdana',
    'Courier New',
    'Palatino',
    'Garamond',
    'Bookman',
    'Comic Sans MS'
  ]);

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const handleDragStart = (e, element) => {
    setIsDragging(true);
    setSelectedElement(element);
    const canvas = canvasRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - canvas.left,
      y: e.clientY - canvas.top
    });
  };

  const handleDragMove = (e) => {
    if (isDragging && selectedElement) {
      const canvas = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvas.left;
      const y = e.clientY - canvas.top;
      
      const deltaX = x - dragStart.x;
      const deltaY = y - dragStart.y;

      setElements(elements.map(el => 
        el.id === selectedElement.id
          ? { ...el, x: el.x + deltaX, y: el.y + deltaY }
          : el
      ));
      setDragStart({ x, y });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const updateElementProperty = (property, value) => {
    if (selectedElement) {
      setElements(elements.map(el =>
        el.id === selectedElement.id
          ? { ...el, [property]: value }
          : el
      ));
      setSelectedElement(prev => ({ ...prev, [property]: value }));
    }
  };

  const addNewElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      content: type === 'text' ? 'New Text' : '',
      x: 400,
      y: 300,
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
      bold: false,
      italic: false,
      underline: false,
      align: 'left',
      rotation: 0,
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Elements */}
      <div className="w-64 bg-white border-r p-4">
        <h2 className="text-lg font-semibold mb-4">Elements</h2>
        <div className="space-y-2">
          <button
            onClick={() => addNewElement('text')}
            className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Type size={20} />
            <span>Add Text</span>
          </button>
          <button
            onClick={() => addNewElement('image')}
            className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Image size={20} />
            <span>Add Image</span>
          </button>
          <button
            onClick={() => addNewElement('shape')}
            className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Square size={20} />
            <span>Add Shape</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center gap-4">
            {selectedElement && selectedElement.type === 'text' && (
              <>
                <select
                  value={selectedElement.fontFamily}
                  onChange={(e) => updateElementProperty('fontFamily', e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  {availableFonts.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>

                <input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) => updateElementProperty('fontSize', parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border rounded"
                />

                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => updateElementProperty('color', e.target.value)}
                  className="w-8 h-8 p-1 border rounded"
                />

                <div className="flex items-center gap-2 border-l pl-4">
                  <button
                    onClick={() => updateElementProperty('bold', !selectedElement.bold)}
                    className={`p-1 rounded ${selectedElement.bold ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    <Bold size={20} />
                  </button>
                  <button
                    onClick={() => updateElementProperty('italic', !selectedElement.italic)}
                    className={`p-1 rounded ${selectedElement.italic ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    <Italic size={20} />
                  </button>
                  <button
                    onClick={() => updateElementProperty('underline', !selectedElement.underline)}
                    className={`p-1 rounded ${selectedElement.underline ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    <Underline size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2 border-l pl-4">
                  <button
                    onClick={() => updateElementProperty('align', 'left')}
                    className={`p-1 rounded ${selectedElement.align === 'left' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    <AlignLeft size={20} />
                  </button>
                  <button
                    onClick={() => updateElementProperty('align', 'center')}
                    className={`p-1 rounded ${selectedElement.align === 'center' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    <AlignCenter size={20} />
                  </button>
                  <button
                    onClick={() => updateElementProperty('align', 'right')}
                    className={`p-1 rounded ${selectedElement.align === 'right' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  >
                    <AlignRight size={20} />
                  </button>
                </div>

                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedElement.rotation}
                  onChange={(e) => updateElementProperty('rotation', parseInt(e.target.value))}
                  className="w-32"
                />
              </>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-8 overflow-auto">
          <div 
            ref={canvasRef}
            className="w-[842px] h-[595px] mx-auto bg-white shadow-lg"
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {elements.map(element => (
              <div
                key={element.id}
                className={`absolute cursor-move ${
                  selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  transform: `rotate(${element.rotation}deg)`,
                  transformOrigin: 'center',
                }}
                onClick={() => handleElementClick(element)}
                onMouseDown={(e) => handleDragStart(e, element)}
              >
                {element.type === 'text' && (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateElementProperty('content', e.target.textContent)}
                    style={{
                      fontFamily: element.fontFamily,
                      fontSize: `${element.fontSize}px`,
                      color: element.color,
                      fontWeight: element.bold ? 'bold' : 'normal',
                      fontStyle: element.italic ? 'italic' : 'normal',
                      textDecoration: element.underline ? 'underline' : 'none',
                      textAlign: element.align,
                      minWidth: '50px',
                      minHeight: '1em',
                    }}
                  >
                    {element.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-64 bg-white border-l p-4">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        {selectedElement ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500">X</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.x)}
                    onChange={(e) => updateElementProperty('x', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Y</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.y)}
                    onChange={(e) => updateElementProperty('y', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rotation
              </label>
              <input
                type="number"
                value={selectedElement.rotation}
                onChange={(e) => updateElementProperty('rotation', parseInt(e.target.value))}
                className="w-full px-2 py-1 border rounded"
              />
            </div>

            {selectedElement.type === 'text' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size
                  </label>
                  <input
                    type="number"
                    value={selectedElement.fontSize}
                    onChange={(e) => updateElementProperty('fontSize', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) => updateElementProperty('color', e.target.value)}
                    className="w-full h-8 p-1 border rounded"
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Select an element to edit its properties</p>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save size={20} />
            Save Template
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateEditor; 