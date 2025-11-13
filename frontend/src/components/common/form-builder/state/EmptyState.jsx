
const EmptyState = ({ title, description, icon: Icon }) => (
  <div className="text-center py-12 text-gray-500">
    <Icon size={48} className="mx-auto mb-4 text-gray-300" />
    <p className="text-lg">{title}</p>
    <p>{description}</p>
  </div>
);

export default EmptyState