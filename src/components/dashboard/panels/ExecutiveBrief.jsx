import {
    Sparkles,
    Building2,
    Briefcase,
    ShieldCheck,
    ArrowRight
} from "lucide-react";

export default function ExecutiveBrief({

    executiveBrief,

    loading = false

}) {

    if (loading) {

        return (

            <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse">

                <div className="h-8 w-64 bg-gray-200 rounded" />

                <div className="mt-6 h-5 w-full bg-gray-200 rounded" />

                <div className="mt-3 h-5 w-5/6 bg-gray-200 rounded" />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

                    {[1,2,3,4].map((i)=>(

                        <div
                            key={i}
                            className="h-20 bg-gray-100 rounded-xl"
                        />

                    ))}

                </div>

            </div>

        );

    }

    if (!executiveBrief) {

        return (

            <div className="bg-white rounded-2xl border border-gray-200 p-8">

                <h2 className="text-xl font-bold">

                    Executive Brief

                </h2>

                <p className="text-gray-500 mt-4">

                    Aura has not generated an executive briefing yet.

                </p>

            </div>

        );

    }

    return (

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8">

                <div className="flex justify-between items-start">

                    <div>

                        <div className="flex items-center gap-2">

                            <Sparkles size={18} />

                            <span className="text-sm opacity-90">

                                Executive Brief

                            </span>

                        </div>

                        <h1 className="text-3xl font-bold mt-4">

                            {executiveBrief.greeting}

                        </h1>

                        <p className="mt-4 text-indigo-100 leading-7 max-w-3xl">

                            {executiveBrief.summary}

                        </p>

                    </div>

                    <ShieldCheck
                        size={42}
                    />

                </div>

            </div>

            <div className="p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <div className="rounded-xl border p-5">

                        <div className="text-xs uppercase text-gray-500">

                            Organization

                        </div>

                        <div className="flex items-center gap-2 mt-3">

                            <Building2 size={18}/>

                            <span className="font-semibold">

                                {executiveBrief.organization}

                            </span>

                        </div>

                    </div>

                    <div className="rounded-xl border p-5">

                        <div className="text-xs uppercase text-gray-500">

                            Workspace

                        </div>

                        <div className="flex items-center gap-2 mt-3">

                            <Briefcase size={18}/>

                            <span className="font-semibold">

                                {executiveBrief.workspace}

                            </span>

                        </div>

                    </div>

                    <div className="rounded-xl border p-5">

                        <div className="text-xs uppercase text-gray-500">

                            Top Priority

                        </div>

                        <div className="mt-3 font-semibold">

                            {executiveBrief.top_priority}

                        </div>

                    </div>

                    <div className="rounded-xl border p-5">

                        <div className="text-xs uppercase text-gray-500">

                            AI Confidence

                        </div>

                        <div className="mt-3 text-2xl font-bold text-indigo-600">

                            {executiveBrief.confidence ?? "--"}

                            {executiveBrief.confidence && "%"}

                        </div>

                    </div>

                </div>

                <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-6">

                    <div className="text-sm font-semibold text-gray-500">

                        Recommended Action

                    </div>

                    <div className="mt-3 text-lg font-semibold">

                        {executiveBrief.recommended_action}

                    </div>

                </div>

                <div className="mt-8 flex flex-wrap gap-4">

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition"
                    >

                        Ask Aura

                        <ArrowRight size={18}/>

                    </button>

                    <button
                        className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium transition"
                    >

                        Run Intelligence

                    </button>

                </div>

            </div>

        </div>

    );

}