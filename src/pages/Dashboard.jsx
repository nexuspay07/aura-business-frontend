import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getWorkspaceSessions } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  useOrganization,
} from "../context/OrganizationContext";

export default function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
  organizations,
  activeOrganization,
  setActiveOrganization,
} = useOrganization();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getWorkspaceSessions(1);

      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div>
         <h1 className="text-4xl font-bold text-gray-900">
  {activeOrganization
    ? activeOrganization.name
    : "AURA Workspace"}
</h1>

          <p className="text-gray-500 mt-2">
            AI-powered enterprise intelligence environment
          </p>
        </div>

        <div className="mt-4">

  <select
    value={
      activeOrganization?.id || ""
    }
    onChange={(e) => {

      const selected =
        organizations.find(
          (org) =>
            org.id ===
            Number(e.target.value)
        );

      setActiveOrganization(
        selected
      );
    }}
    className="
      px-4 py-2
      border border-gray-200
      rounded-xl
      bg-white
    "
  >

    {organizations.map((org) => (
      <option
        key={org.id}
        value={org.id}
      >
        {org.name}
      </option>
    ))}

  </select>

</div>



        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-400">
              Intelligence Sessions
            </p>

            <h2 className="text-4xl font-bold mt-3 text-gray-900">
              {sessions.length}
            </h2>

            <p className="text-green-500 text-sm mt-3">
              Live backend data
            </p>
          </div>



          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-400">
              Active Organizations
            </p>

            <h2 className="text-4xl font-bold mt-3 text-gray-900">
              1
            </h2>

            <p className="text-blue-500 text-sm mt-3">
              System operational
            </p>
          </div>



          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-400">
              Strategic Accuracy
            </p>

            <h2 className="text-4xl font-bold mt-3 text-gray-900">
              94%
            </h2>

            <p className="text-purple-500 text-sm mt-3">
              Reinforcement learning active
            </p>
          </div>



          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <p className="text-sm text-gray-400">
              AI Status
            </p>

            <h2 className="text-4xl font-bold mt-3 text-green-500">
              ONLINE
            </h2>

            <p className="text-gray-500 text-sm mt-3">
              Autonomous intelligence active
            </p>
          </div>

        </div>



        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Strategic Intelligence Feed
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Real-time AI business analysis
                </p>
              </div>

              <div className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full">
                LIVE
              </div>
            </div>



            {loading ? (
              <div className="text-gray-500">
                Loading intelligence sessions...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-gray-400">
                No intelligence sessions found
              </div>
            ) : (
              <div className="space-y-4">

                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
                  >

                    <div className="flex items-start justify-between">

                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {session.title}
                        </h3>

                        <p className="text-gray-500 mt-2">
                          {session.summary}
                        </p>
                      </div>

                      <div className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600">
                        {session.status}
                      </div>

                    </div>



                    <div className="mt-4 flex flex-wrap gap-3">

                      <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                        {session.domain}
                      </div>

                      <div className="bg-purple-100 px-3 py-1 rounded-full text-xs text-purple-700">
                        {session.business_model}
                      </div>

                      <div className="bg-blue-100 px-3 py-1 rounded-full text-xs text-blue-700">
                        Risk: {session.risk_level}
                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>



          {/* RIGHT SIDE */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-3xl shadow-xl p-6 text-white">

            <p className="text-xs opacity-80">
              Autonomous Intelligence
            </p>

            <h2 className="text-4xl font-bold mt-3">
              AURA Strategic Engine
            </h2>

            <p className="mt-4 text-sm opacity-90 leading-relaxed">
              Enterprise intelligence systems are actively learning
              from organizational interactions and strategic decision
              patterns.
            </p>

            <button
               onClick={() => navigate("/intelligence")}
                className="mt-8 bg-white text-black px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition"
                 >
                Open Intelligence
</button>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}