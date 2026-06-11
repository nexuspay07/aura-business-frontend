import { useEffect, useState } from "react";

import api, {
  getWorkspaceSessions
} from "../services/api";

import {
  Trash2,
  Brain
} from "lucide-react";

export default function SessionsWorkspace() {

  const [sessions, setSessions] =
    useState([]);

  const [
    selectedSession,
    setSelectedSession
  ] = useState(null);

  useEffect(() => {

    loadSessions();

  }, []);

  const loadSessions = async () => {

    try {

      const response =
        await getWorkspaceSessions(1);

      const loadedSessions =
        response.sessions || [];

      setSessions(
        loadedSessions
      );

      if (
        loadedSessions.length > 0 &&
        !selectedSession
      ) {

        setSelectedSession(
          loadedSessions[0]
        );

      }

    } catch (error) {

      console.error(error);

    }
  };

  const deleteSession =
    async (
      event,
      sessionId
    ) => {

      event.stopPropagation();

      try {

        await api.delete(
          `/intelligence-sessions/${sessionId}`
        );

        if (
          selectedSession?.id
          === sessionId
        ) {

          setSelectedSession(
            null
          );

        }

        await loadSessions();

      } catch (error) {

        console.error(error);

      }
    };

  return (

    <div className="flex h-screen bg-slate-100">

      {/* SIDEBAR */}

      <div
        className="
          w-96
          bg-white
          border-r
          overflow-y-auto
        "
      >

        <div className="p-6 border-b">

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Aura Sessions
          </h1>

          <p
            className="
              text-slate-500
              text-sm
            "
          >
            Executive Intelligence History
          </p>

        </div>

        <div className="p-4">

          {sessions.length === 0 && (

            <p className="text-slate-500">
              No sessions found.
            </p>

          )}

          {sessions.map(
            (session) => (

              <div
                key={session.id}
                onClick={() =>
                  setSelectedSession(
                    session
                  )
                }
                className={`
                  cursor-pointer
                  rounded-xl
                  border
                  p-4
                  mb-3
                  transition

                  ${
                    selectedSession?.id
                    === session.id
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white hover:bg-slate-50"
                  }
                `}
              >

                <div
                  className="
                    flex
                    justify-between
                    items-start
                  "
                >

                  <div>

                    <h3
                      className="
                        font-semibold
                      "
                    >
                      {session.title}
                    </h3>

                    <p
                      className="
                        text-sm
                        text-slate-500
                        mt-1
                      "
                    >
                      Risk:
                      {" "}
                      {session.risk_level}
                    </p>

                  </div>

                  <button
                    onClick={(e) =>
                      deleteSession(
                        e,
                        session.id
                      )
                    }
                    className="
                      text-red-500
                    "
                  >

                    <Trash2
                      size={18}
                    />

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

      {/* VIEWER */}

      <div
        className="
          flex-1
          overflow-y-auto
          p-8
        "
      >

        {!selectedSession ? (

          <div
            className="
              h-full
              flex
              items-center
              justify-center
            "
          >

            <div className="text-center">

              <Brain
                size={48}
                className="
                  mx-auto
                  mb-4
                "
              />

              <h2
                className="
                  text-2xl
                  font-bold
                "
              >
                Select A Session
              </h2>

            </div>

          </div>

        ) : (

          <div
            className="
              bg-white
              rounded-3xl
              border
              shadow-sm
              p-8
            "
          >

            <h1
              className="
                text-3xl
                font-bold
                mb-2
              "
            >
              {selectedSession.title}
            </h1>

            <p
              className="
                text-slate-500
                mb-8
              "
            >
              Strategy:
              {" "}
              {
                selectedSession
                  .recommended_move
              }

              {" • "}

              Risk:
              {" "}
              {
                selectedSession
                  .risk_level
              }
            </p>

            <div className="space-y-8">

              <section>

                <h2
                  className="
                    text-xl
                    font-semibold
                    mb-2
                  "
                >
                  Executive Summary
                </h2>

                <p>
                  {
                    selectedSession
                      ?.report_json
                      ?.executive_summary

                    ||

                    selectedSession
                      ?.summary

                    ||

                    "Not available"
                  }
                </p>

              </section>

              <section>

                <h2
                  className="
                    text-xl
                    font-semibold
                    mb-2
                  "
                >
                  Strategic Position
                </h2>

                <p>
                  {
                    selectedSession
                      ?.report_json
                      ?.strategic_position

                    ||

                    "Not available"
                  }
                </p>

              </section>

              <section>

                <h2
                  className="
                    text-xl
                    font-semibold
                    mb-2
                  "
                >
                  Market Analysis
                </h2>

                <p>
                  {
                    selectedSession
                      ?.report_json
                      ?.market_analysis

                    ||

                    "Not available"
                  }
                </p>

              </section>

              <section>

                <h2
                  className="
                    text-xl
                    font-semibold
                    mb-2
                  "
                >
                  Growth Strategy
                </h2>

                <p>
                  {
                    selectedSession
                      ?.report_json
                      ?.growth_strategy

                    ||

                    selectedSession
                      ?.recommended_move

                    ||

                    "Not available"
                  }
                </p>

              </section>

              <section>

                <h2
                  className="
                    text-xl
                    font-semibold
                    mb-2
                  "
                >
                  Operational Plan
                </h2>

                <p>
                  {
                    selectedSession
                      ?.report_json
                      ?.operational_plan

                    ||

                    "Not available"
                  }
                </p>

              </section>

              <section>

                <h2
                  className="
                    text-xl
                    font-semibold
                    mb-2
                  "
                >
                  Growth Projection
                </h2>

                <p>
                  {
                    selectedSession
                      ?.report_json
                      ?.growth_projection

                    ||

                    "Not available"
                  }
                </p>

              </section>

              <section>

                <h2
                  className="
                    text-xl
                    font-semibold
                    mb-2
                  "
                >
                  Strategic Warning
                </h2>

                <p>
                  {
                    selectedSession
                      ?.report_json
                      ?.strategic_warning

                    ||

                    "Not available"
                  }
                </p>

              </section>

              <section>

                <h2
                  className="
                    text-xl
                    font-semibold
                    mb-2
                  "
                >
                  Next Steps
                </h2>

                <ul className="list-disc ml-6">

                  {(
                    selectedSession
                      ?.report_json
                      ?.next_steps
                    || []
                  ).map(
                    (
                      step,
                      index
                    ) => (

                      <li
                        key={index}
                      >
                        {step}
                      </li>

                    )
                  )}

                </ul>

              </section>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}