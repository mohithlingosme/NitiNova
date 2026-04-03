import CitationCard from "./CitationCard";

const ResultPanel = ({ data }) => {
  const confidenceColor = data.confidence > 85 ? 'from-green-500 to-green-600 bg-green-100 text-green-800' : data.confidence > 70 ? 'from-yellow-500 to-yellow-600 bg-yellow-100 text-yellow-800' : 'from-red-500 to-red-600 bg-red-100 text-red-800';
  
  return (
    <div>
      <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
        <span className={`px-4 py-2 rounded-full text-lg font-bold ${confidenceColor}`}>
          {data.confidence}% Confidence
        </span>
      </div>

      <ul className="mb-8 text-sm space-y-2 text-gray-700">
        <li className="flex items-center"><span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xs font-bold mr-2">✔</span>Argument legally valid</li>
        <li className="flex items-center"><span className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 text-xs font-bold mr-2">⚠</span>Weak precedent detected</li>
        <li className="flex items-center"><span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-red-700 text-xs font-bold mr-2">❌</span>1 citation invalid</li>
      </ul>

      <div className="space-y-4">
        {data.citations.map((c, i) => (
          <CitationCard key={i} data={c} />
        ))}
      </div>
    </div>
  );
};

export default ResultPanel;
