import { CATEGORIES } from "../../../../constants/documentSupport.js";

const StepThree = ({ getValues }) => {
    const { title, category, tags } = getValues()
    const selectedCategory = CATEGORIES.find(c => c.value === category);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to upload?</h2>
          <p className="text-gray-600">Review your files and details before uploading</p>
        </div>
  
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Upload Details</h3>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Title:</span> {title}</div>
              <div><span className="font-medium">Category:</span> {selectedCategory?.label}</div>
              {tags && <div><span className="font-medium">Tags:</span> {tags}</div>}
            </div>
          </div>
        </div>
      </div>
    );
};

export default StepThree