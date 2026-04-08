import { useState } from "react";
import { motion } from "motion/react";
import { Mic, MicOff, Send, User, Bot, Play, Square, CheckCircle2 } from "lucide-react";
import { startMockInterview } from "../services/ai";

export default function Interview() {
  const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([
    { role: "ai", text: "Hello! I'm your AI technical interviewer. Are you ready to start your mock interview for a Software Engineer position?" }
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // In a real app, we'd send the whole conversation history
      const aiResponse = await startMockInterview("Software Engineer");
      setMessages(prev => [...prev, { role: "ai", text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "I'm sorry, I encountered an error. Let's try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Mock Interview</h1>
        <p className="text-slate-400 mt-1">Practice your technical and behavioral skills with our AI interviewer.</p>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col mb-6 shadow-xl">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-red-500" : "bg-slate-800 border border-slate-700"
              }`}>
                {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-red-500" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user" 
                  ? "bg-red-500 text-white rounded-tr-none" 
                  : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm italic">
              <Bot className="w-4 h-4 animate-pulse" />
              AI is thinking...
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`p-3 rounded-full transition-all ${
                isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your answer here..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-widest font-bold">
            AI Interviewer is powered by Gemini 3.0
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Play className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Session Duration</p>
            <p className="text-sm font-bold">12:45</p>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Confidence Score</p>
            <p className="text-sm font-bold">82%</p>
          </div>
        </div>
        <button 
          onClick={() => alert("Interview results are being processed by AI...")}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-4 rounded-xl font-bold transition-all"
        >
          End & Get Feedback
        </button>
      </div>
    </div>
  );
}

