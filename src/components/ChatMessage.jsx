import ResultPanel from "./ResultPanel";

const ChatMessage = ({ message }) => {
  if (message.type === "user") {
    return (
      <div className="flex justify-end mb-6">
        <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white px-6 py-5 rounded-2xl shadow-xl max-w-2xl ml-auto transform -mr-4 hover:shadow-2xl transition-all duration-200">
          <p className="text-base leading-relaxed">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 max-w-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <ResultPanel data={message.data} />
      </div>
    </div>
  );
};

export default ChatMessage;
