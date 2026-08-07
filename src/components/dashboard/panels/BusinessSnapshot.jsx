import {
    Activity,
    TrendingUp,
    AlertTriangle,
    Brain
} from "lucide-react";

export default function BusinessSnapshot({

    snapshot,

    loading = false

}) {

    if (loading) {

        return (

            <div className="bg-white rounded-2xl border border-gray-200 p-8">

                <div className="animate-pulse">

                    <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                        {[1,2,3,4].map((i)=>(

                            <div
                                key={i}
                                className="h-28 rounded-xl bg-gray-100"
                            />

                        ))}

                    </div>

                </div>

            </div>

        );

    }

    const cards = [

        {

            title: "Business Health",

            value:
                snapshot?.health_score ??
                "Unknown",

            icon: Activity,

            color: "text-green-600"

        },

        {

            title: "Growth Trend",

            value:
                snapshot?.growth_score ??
                "Unknown",

            icon: TrendingUp,

            color: "text-blue-600"

        },

        {

            title: "Risk Level",

            value:
                snapshot?.risk_level ??
                "Unknown",

            icon: AlertTriangle,

            color: "text-orange-500"

        },

        {

            title: "AI Confidence",

            value:
                snapshot?.ai_confidence ??
                "--",

            icon: Brain,

            color: "text-indigo-600"

        }

    ];

    return (

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

            <div className="mb-8">

                <h2 className="text-2xl font-bold">

                    Business Snapshot

                </h2>

                <p className="text-gray-500 mt-2">

                    Your business at a glance.

                </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {cards.map((card) => {

                    const Icon = card.icon;

                    return (

                        <div

                            key={card.title}

                            className="rounded-xl border border-gray-200 p-6 hover:shadow-md transition"

                        >

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-gray-500">

                                    {card.title}

                                </span>

                                <Icon

                                    className={card.color}

                                    size={22}

                                />

                            </div>

                            <div className="mt-6 text-3xl font-bold">

                                {card.value}

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}