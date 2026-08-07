import {
    Lightbulb,
    ArrowRight,
    AlertCircle
} from "lucide-react";

export default function ExecutiveRecommendations({

    recommendations,

    loading = false

}) {

    if (loading) {

        return (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                <div className="animate-pulse">

                    <div className="h-6 w-56 bg-gray-200 rounded mb-8"></div>

                    <div className="space-y-4">

                        {[1,2].map((i)=>(

                            <div

                                key={i}

                                className="h-36 rounded-xl bg-gray-100"

                            />

                        ))}

                    </div>

                </div>

            </div>

        );

    }

    if (!recommendations || recommendations.length === 0) {

        return (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                <div className="flex items-center gap-3">

                    <Lightbulb
                        className="text-indigo-600"
                    />

                    <h2 className="text-2xl font-bold">

                        Executive Recommendations

                    </h2>

                </div>

                <div className="mt-8 text-center py-12">

                    <AlertCircle
                        className="mx-auto text-gray-400"
                        size={48}
                    />

                    <p className="mt-4 text-gray-600">

                        Aura has not generated any recommendations yet.

                    </p>

                    <p className="text-gray-400 mt-2">

                        Run an intelligence analysis to receive AI-powered business recommendations.

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

            <div className="flex items-center gap-3 mb-8">

                <Lightbulb
                    className="text-indigo-600"
                />

                <h2 className="text-2xl font-bold">

                    Executive Recommendations

                </h2>

            </div>

            <div className="space-y-6">

                {recommendations.map((item, index) => (

                    <div

                        key={index}

                        className="rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition"

                    >

                        <div className="flex justify-between items-start">

                            <div>

                                <h3 className="text-lg font-bold">

                                    {item.title}

                                </h3>

                                <p className="text-gray-600 mt-3 leading-7">

                                    {item.reason}

                                </p>

                            </div>

                            <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">

                                {item.priority}

                            </span>

                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div>

                                <div className="text-xs uppercase text-gray-500">

                                    Expected Impact

                                </div>

                                <div className="mt-2 font-semibold">

                                    {item.impact}

                                </div>

                            </div>

                            <div>

                                <div className="text-xs uppercase text-gray-500">

                                    Recommended Action

                                </div>

                                <div className="mt-2 font-semibold">

                                    {item.action}

                                </div>

                            </div>

                        </div>

                        <button

                            className="mt-8 flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700"

                        >

                            View Strategy

                            <ArrowRight size={18}/>

                        </button>

                    </div>

                ))}

            </div>

        </div>

    );

}