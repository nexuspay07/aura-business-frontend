import { useState } from "react";

import api from "../services/api";

import ExecutiveMissionCard from "../components/intelligence/ExecutiveMissionCard";
import StrategicActionsCard from "../components/intelligence/StrategicActionsCard";
import IntelligenceFeedCard from "../components/intelligence/IntelligenceFeedCard";
import AuraBrainCard from "../components/intelligence/AuraBrainCard";

import {
  Sparkles,
  Send,
} from "lucide-react";

export default function AuraCommandCenter() {

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const [cognition, setCognition] = useState({});

  const handleAnalyze = async () => {

    if (!prompt.trim()) return;

    setLoading(true);

    try {

      const response = await api.post("/chat", {
        message: prompt,
        session_id: "workspace_session",
        organization_id: 1,
        workspace_id: 1,
      });

      console.log(
  "FULL RESPONSE:",
  JSON.stringify(
    response.data,
    null,
    2
  )
);

     console.log(
  "FULL RESPONSE:",
  response.data
);

console.log(
  "RESPONSE OBJECT:",
  response.data.response
);

setCognition(
  response.data.response
);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="grid grid-cols-12 gap-6">

      {/* LEFT */}
      <div className="col-span-3 space-y-6">

        <ExecutiveMissionCard
          objective={prompt}
          strategy={
            cognition.recommended_strategy
          }
          confidence={
            cognition.confidence
              ? Math.round(
                  cognition.confidence * 100
                )
              : 0
          }
          risk={
            cognition.risk_level
          }
        />

        <StrategicActionsCard
          executionFocus={
            cognition.execution_focus
          }
          recommendation={
            cognition.reinforcement_recommendation
          }
        />

      </div>

      {/* CENTER */}
      <div className="col-span-6">

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

          <div className="flex items-center gap-3 mb-6">

            <Sparkles
              size={22}
              className="text-violet-600"
            />

            <h2 className="text-xl font-bold text-slate-900">
              Aura Mission Console
            </h2>

          </div>

          <textarea
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            placeholder="Describe a business challenge, objective, opportunity, or simulation..."
            className="w-full h-40 bg-slate-50 rounded-2xl p-4 outline-none resize-none"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 text-white flex items-center gap-3 hover:scale-[1.02] transition"
          >
            <Send size={18} />

            {loading
              ? "Analyzing..."
              : "Launch Intelligence"}
          </button>

        </div>

        <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Executive Intelligence
          </h2>

          {cognition.summary ? (
  <div className="space-y-4">

    <div>
      <h3 className="font-semibold">
        Executive Summary
      </h3>
      <p>{cognition.summary}</p>
    </div>

    <div>
      <h3 className="font-semibold">
        Market Insight
      </h3>
      <p>{cognition.market_insight}</p>
    </div>

    <div>
      <h3 className="font-semibold">
        Execution Focus
      </h3>
      <p>{cognition.execution_focus}</p>
    </div>

    <div>
      <h3 className="font-semibold">
        Growth Projection
      </h3>
      <p>{cognition.growth_projection}</p>
    </div>

    <div>
      <h3 className="font-semibold">
        Strategic Warning
      </h3>
      <p>{cognition.warning}</p>
    </div>

    <div>
      <h3 className="font-semibold">
        Next Steps
      </h3>

      <ul className="list-disc ml-6">
        {(cognition.next_steps || [])
          .map((step, index) => (
            <li key={index}>
              {step}
            </li>
          ))}
      </ul>
    </div>

  </div>
) : (
  <p>
    Awaiting intelligence request...
  </p>
)}

        </div>

      </div>

      {/* RIGHT */}
      <div className="col-span-3 space-y-6">

        <IntelligenceFeedCard
          marketInsight={
            cognition.market_insight
          }
          warning={
            cognition.warning
          }
          reinforcementStatus={
            cognition.reinforcement_status
          }
        />

        <AuraBrainCard />

      </div>

    </div>
  );
}