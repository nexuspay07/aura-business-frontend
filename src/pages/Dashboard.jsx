import DashboardLayout from "../layouts/DashboardLayout";

import useDashboard from "../components/dashboard/hooks/useDashboard";
import ExecutiveReport from "../components/intelligence/ExecutiveReport";
import PersonalHome from "./PersonalHome";
import { useSession } from "../context/SessionContext";

export default function Dashboard() {

    const { productMode } = useSession();

    if (productMode === "personal") return <DashboardLayout><PersonalHome /></DashboardLayout>;

    return <BusinessDashboard />;
}

function BusinessDashboard() {

    const {

        intelligence,

        loading,

        running,

        error,

        runAura

    } = useDashboard();

    async function handleSubmit(e) {

        e.preventDefault();

        const message =
            e.target.message.value.trim();

        if (!message) return;

        await runAura({

            message

        });

    }

    if (loading) {

        return (

            <DashboardLayout>

                <div className="flex items-center justify-center h-[70vh]">

                    <div className="text-center">

                        <h1 className="text-3xl font-bold">

                            Loading Aevric AI...

                        </h1>

                    </div>

                </div>

            </DashboardLayout>

        );

    }

    if (error) {

        return (

            <DashboardLayout>

                <div className="flex items-center justify-center h-[70vh]">

                    <div className="bg-white rounded-2xl shadow-lg p-10">

                        <h2 className="text-2xl font-bold text-red-600">

                            Unable to load Aevric AI

                        </h2>

                        <p className="text-gray-500 mt-3">

                            Please refresh the page.

                        </p>

                    </div>

                </div>

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}

                <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-blue-600 text-white p-10 shadow-xl">

                    <h1 className="text-4xl font-bold">

                        Aevric AI Executive Intelligence

                    </h1>

                    <p className="mt-3 text-violet-100">

                        Ask Aevric AI to analyze any business challenge,
                        opportunity or strategic decision.

                    </p>

                </div>

                {/* Mission Console */}

                <div className="bg-white rounded-3xl shadow-md p-8">

                    <h2 className="text-2xl font-semibold mb-6">

                        Executive Mission

                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <textarea

                            name="message"

                            rows={6}

                            placeholder="Describe your business objective, challenge or opportunity..."

                            className="w-full rounded-2xl border border-gray-200 p-5 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"

                        />

                        <button

                            disabled={running}

                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:opacity-90 transition"

                        >

                            {

                                running

                                    ? "Analyzing..."

                                    : "Launch Intelligence"

                            }

                        </button>

                    </form>

                </div>

                {/* Executive Response */}

                <ExecutiveReport report={intelligence?.executive_report} />

            </div>

        </DashboardLayout>

    );

}
