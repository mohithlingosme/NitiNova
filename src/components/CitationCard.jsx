const CitationCard = ({ data }) => {
  const getColor = () => {
    if (data.status === "valid") return "border-green-500";
    if (data.status === "warning") return "border-yellow-500";
    return "border-red-500";
  };

  return (
    <div className={`group border-l-4 p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-sm border-gray-200 hover:shadow-md hover:bg-gray-50 hover:-translate-x-2 transition-all duration-300 cursor-pointer border-opacity-50 ${getColor()}`}>
      <h4 className="font-semibold text-gray-900 mb-1.5 group-hover:text-blue-700 transition-colors">{data.title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{data.description}</p>
    </div>
  );
};

export default CitationCard;
