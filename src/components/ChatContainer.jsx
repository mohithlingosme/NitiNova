import { useEffect, useRef, useState, useCallback } from "react";
import ChatMessage from "./ChatMessage";
import LoaderSteps from "./LoaderSteps";

const ChatContainer = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 6) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
      return () => clearInterval(interval);
    } else {
      setCurrentStep(0);
    }
  }, [loading]);

  return (
    <div className="flex-1 overflow-y-auto py-8 px-6 md:px-12 max-w-4xl mx-auto w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 space-y-6">
      {!messages.length && !loading && (
        <div className="flex flex-col items-center justify-center h-full text-center py-20 px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
            <span className="text-2xl font-bold text-white">⚖️</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Verify Your Legal Argument
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Paste your argument to check citations, precedents, and legal validity instantly
          </p>
          <button
            onClick={() => {
              // Autofill example
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
          >
            Try Example Argument
          </button>
        </div>
      )}
      {messages.map((msg, index) => (
        <ChatMessage key={index} message={msg} />
      ))}
      {loading && (
        <div className="flex items-center gap-2 text-green-600 text-sm p-4 bg-green-50/50 rounded-2xl max-w-md mx-auto">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          AI is analyzing...
        </div>
      )}
      <div ref={messagesEndRef} />

      {loading && <LoaderSteps currentStep={currentStep} />}
    </div>
  );
};

export default ChatContainer;
