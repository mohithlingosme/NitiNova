const steps = [
  "Reading legal argument...",
  "Extracting legal issues...",
  "Searching Supreme Court database...",
  "Matching precedents...",
  "Validating citations...",
  "Generating court-ready report..."
];

const LoaderSteps = ({ currentStep = 0 }) => {
  const visibleSteps = steps.slice(0, currentStep);
  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl animate-spin-slow flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <div className="animate-pulse">
          <div className="h-2 bg-blue-200 rounded-full w-24"></div>
        </div>
      </div>
      <div className="space-y-3">
        {visibleSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-gray-600 animate-in fade-in-slide-down duration-500 delay-[50ms]">
            <span className="animate-pulse">●</span>
            <span className="font-medium">{step}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-6 text-center font-medium animate-pulse">
        This may take 30-60 seconds...
      </p>
    </div>
  );
};

export default LoaderSteps;
