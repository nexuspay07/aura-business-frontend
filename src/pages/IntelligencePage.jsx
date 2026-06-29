import { useState } from "react";

import {
  Search,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";

export default function IntelligencePage() {

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "AURA Strategic Intelligence initialized. Ask for business, growth, operational, or strategic analysis.",
    },
  ]);


  // =====================================================
  // HANDLE SEND
  // =====================================================

  const handleSend = async () => {

    if (!prompt.trim()) return;

    const userMessage = {
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {

      // =====================================================
      // REAL AI CHAT ENGINE
      // =====================================================

      const response = await api.post("/chat", {
        message: prompt,
        session_id: "workspace_session",
        organization_id: 1,
        workspace_id: 1,
      });

      console.log("AURA RESPONSE:", response.data);

      const cognition = {

  ...response.data.chat_response,

  ...response.data.executive_advisor,

  ...response.data.conversational_response,

  ...response.data.standardized_output,

  ...response.data.executive_response,

  ...response.data.executive_synthesis,

  ...response.data.final_response

};

const aiResponse = {
  role: "assistant",

  content: `
STRATEGIC SUMMARY
${cognition.summary || "No strategic summary available."}

━━━━━━━━━━━━━━━━━━

RECOMMENDED STRATEGY
${cognition.recommended_strategy || "N/A"}

━━━━━━━━━━━━━━━━━━

CONFIDENCE
${cognition.confidence || "N/A"}

━━━━━━━━━━━━━━━━━━

MARKET INSIGHT
${cognition.market_insight || "N/A"}

━━━━━━━━━━━━━━━━━━

EXECUTION FOCUS
${cognition.execution_focus || "N/A"}

━━━━━━━━━━━━━━━━━━

RISK WARNING
${cognition.warning || "No major risks detected."}

━━━━━━━━━━━━━━━━━━

REINFORCEMENT STATUS
${cognition.reinforcement_status || "No reinforcement data."}

━━━━━━━━━━━━━━━━━━

RECOMMENDATION
${cognition.reinforcement_recommendation || "No recommendation available."}
`,
};


      // =====================================================
      // ADD AI MESSAGE
      // =====================================================

      setMessages((prev) => [...prev, aiResponse]);

    } catch (error) {

      console.error("AI ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "AURA encountered an issue processing this intelligence request.",
        },
      ]);

    } finally {

      setLoading(false);
      setPrompt("");

    }
  };



  return (
    <div className="h-screen flex bg-[#f5f7fb] overflow-hidden">

      {/* ===================================================== */}
      {/* LEFT PANEL */}
      {/* ===================================================== */}

      <aside className="w-[320px] bg-white border-r border-gray-200 flex flex-col">

        {/* HEADER */}
        <div className="p-5 border-b border-gray-100">

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-black text-gray-900">
                AURA
              </h1>

              <p className="text-blue-600 -mt-1">
                Intelligence
              </p>
            </div>

            <button className="w-11 h-11 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 flex items-center justify-center text-white shadow-lg">
              <Plus size={20} />
            </button>

          </div>



          {/* SEARCH */}
          <div className="mt-5 flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-3">

            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search sessions..."
              className="bg-transparent outline-none text-sm w-full"
            />

          </div>

        </div>



        {/* SESSION LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          <div className="bg-gradient-to-r from-violet-600 to-blue-500 rounded-3xl p-5 text-white shadow-xl">

            <p className="text-xs opacity-80">
              ACTIVE SESSION
            </p>

            <h3 className="text-lg font-bold mt-2">
              AI Automation Agency Strategy
            </h3>

            <p className="text-sm opacity-90 mt-3">
              Competitive market analysis and strategic positioning.
            </p>

          </div>

        </div>

      </aside>



      {/* ===================================================== */}
      {/* CENTER PANEL */}
      {/* ===================================================== */}

      <main className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <header className="h-[85px] bg-white border-b border-gray-200 flex items-center justify-between px-8">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Strategic Intelligence Workspace
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Autonomous business intelligence environment
            </p>
          </div>



          <div className="flex items-center gap-3 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles size={16} />
            AI ACTIVE
          </div>

        </header>



        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[850px] px-7 py-5 shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded-[30px] rounded-br-md"
                    : "bg-white border border-gray-100 text-gray-700 rounded-[30px] rounded-bl-md"
                }`}
              >

                <p className="leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>

              </div>

            </div>
          ))}



          {loading && (
            <div className="flex justify-start">

              <div className="bg-white border border-gray-100 rounded-3xl px-6 py-4 text-gray-500 shadow-sm">
                AURA is analyzing strategically...
              </div>

            </div>
          )}

        </div>



        {/* INPUT */}
        <div className="p-6 bg-white border-t border-gray-200">

          <div className="flex items-center gap-4 bg-gray-100 rounded-3xl px-5 py-4">

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AURA for strategic intelligence..."
              className="flex-1 bg-transparent outline-none resize-none text-gray-700"
              rows={1}
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 flex items-center justify-center text-white shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>

          </div>

        </div>

      </main>



      {/* ===================================================== */}
      {/* RIGHT PANEL */}
      {/* ===================================================== */}

      <aside className="w-[360px] bg-white border-l border-gray-200 p-6 overflow-y-auto">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Strategic Intelligence
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Real-time autonomous business analysis
          </p>
        </div>



        {/* CARDS */}
        <div className="mt-8 space-y-5">

          <div className="bg-gradient-to-br from-violet-600 to-blue-500 rounded-3xl p-6 text-white shadow-xl">

            <div className="flex items-center gap-3">
              <TrendingUp size={20} />
              <p className="text-sm opacity-90">
                Growth Probability
              </p>
            </div>

            <h3 className="text-5xl font-bold mt-5">
              78%
            </h3>

            <p className="text-sm opacity-80 mt-4">
              Strong opportunity if niche positioning succeeds.
            </p>

          </div>



          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle size={20} />
              <h3 className="font-semibold">
                Risk Analysis
              </h3>
            </div>

            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              Market saturation and client acquisition costs are the primary operational threats.
            </p>

          </div>



          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

            <div className="flex items-center gap-3 text-green-600">
              <ShieldCheck size={20} />
              <h3 className="font-semibold">
                Strategic Recommendation
              </h3>
            </div>

            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              Build authority in one micro-market before expanding into broader automation services.
            </p>

          </div>

        </div>

      </aside>

    </div>
  );
}