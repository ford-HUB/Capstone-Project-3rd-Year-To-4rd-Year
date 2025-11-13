const DynamicStepHeader = ({ title, description }) => (
    <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default DynamicStepHeader;
