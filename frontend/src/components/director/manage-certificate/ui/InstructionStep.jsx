
const InstructionStep = ({ icon, title, description, bgColor }) => (
    <div className="flex items-start gap-4">
      <div className={`${bgColor} rounded-full p-2 flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
);

export default InstructionStep