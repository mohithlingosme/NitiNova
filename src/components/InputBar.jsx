import { useState } from "react";
import { submitQuery } from "../../services/api";

const InputBar = ({ setMessages, setLoading }) => {
  const [input, setInput] = useState("");

const handleSubmit = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setLoading(true);

    try {
      const result = await submitQuery(input);
      setMessages((prev) => [...prev, { type: "ai", data: result }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { type: "error", text: "Unable to process request. Please try again." }]);
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  return (
    <div className="sticky bottom-0 p-2 bg-gradient-to-t from-gray-50/50 via-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200/50 mx-6 mb-8 max-w-4xl mx-auto z-40">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg">
        <div className="flex items-end gap-3">
          <textarea
            className="flex-1 bg-transparent border-none outline-none resize-none text-lg placeholder-gray-500 text-gray-900 min-h-[120px] max-h-[300px] overflow-y-auto scroll-smooth"
            placeholder="Paste your legal argument or question about Indian law..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-5 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 flex items-center gap-2 whitespace-nowrap disabled:cursor-not-allowed disabled:shadow-none"
          >
            Verify
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Press Enter to verify • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default InputBar;
