import {
    Brain,
    Clock,
    Sparkles
} from "lucide-react";

export default function IntelligenceTimeline({

    activity,

    loading = false

}) {

    if (loading) {

        return (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                <div className="animate-pulse">

                    <div className="h-6 w-48 bg-gray-200 rounded mb-8"></div>

                    <div className="space-y-6">

                        {[1,2,3].map((i)=>(

                            <div

                                key={i}

                                className="h-20 rounded-xl bg-gray-100"

                            />

                        ))}

                    </div>

                </div>

            </div>

        );

    }

    if (!activity || activity.length === 0) {

        return (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                <div className="flex items-center gap-3 mb-8">

                    <Brain className="text-indigo-600"/>

                    <h2 className="text-2xl font-bold">

                        Intelligence Timeline

                    </h2>

                </div>

                <div className="text-center py-12">

                    <Sparkles

                        className="mx-auto text-gray-400"

                        size={48}

                    />

                    <p className="mt-4 text-gray-600">

                        Aevric AI hasn't generated any intelligence yet.

                    </p>

                    <p className="text-gray-400 mt-2">

                        As you interact with Aevric AI, completed analyses and insights will appear here.

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

            <div className="flex items-center gap-3 mb-8">

                <Brain className="text-indigo-600"/>

                <h2 className="text-2xl font-bold">

                    Intelligence Timeline

                </h2>

            </div>

            <div className="space-y-6">

                {

                    activity.map((item,index)=>(

                        <div

                            key={index}

                            className="flex gap-5"

                        >

                            <div>

                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">

                                    <Brain

                                        className="text-indigo-600"

                                        size={20}

                                    />

                                </div>

                            </div>

                            <div className="flex-1">

                                <h3 className="font-bold">

                                    {item.title}

                                </h3>

                                <p className="text-gray-600 mt-2">

                                    {item.description}

                                </p>

                                <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">

                                    <Clock size={15}/>

                                    {item.time}

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}
