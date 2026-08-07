import { useNavigate } from "react-router-dom";

import {
    MessageSquare,
    Brain,
    Building2,
    ArrowRight
} from "lucide-react";

export default function QuickActions({

    actions = []

}) {

    const navigate = useNavigate();

    const defaultActions = [

        {

            title: "Ask Aura",

            description: "Chat with Aura about your business.",

            icon: MessageSquare,

            route: "/intelligence"

        },

        {

            title: "Run Intelligence",

            description: "Generate a fresh executive analysis.",

            icon: Brain,

            route: "/intelligence"

        },

        {

            title: "Business Profile",

            description: "Complete your business profile.",

            icon: Building2,

            route: "/organization"

        }

    ];

    const items = actions.length > 0

        ? actions

        : defaultActions;

    return (

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

            <h2 className="text-2xl font-bold mb-8">

                Quick Actions

            </h2>

            <div className="space-y-5">

                {

                    items.map((item, index) => {

                        const Icon = item.icon || ArrowRight;

                        return (

                            <button

                                key={index}

                                onClick={() => {

                                    if (item.route) {

                                        navigate(item.route);

                                    }

                                }}

                                className="w-full text-left border border-gray-200 rounded-xl p-5 hover:border-indigo-500 hover:shadow-lg transition-all duration-200"

                            >

                                <div className="flex justify-between items-center">

                                    <div>

                                        <div className="font-semibold text-gray-900">

                                            {item.title}

                                        </div>

                                        <div className="text-sm text-gray-500 mt-2">

                                            {item.description}

                                        </div>

                                    </div>

                                    <Icon

                                        className="text-indigo-600"

                                        size={22}

                                    />

                                </div>

                            </button>

                        );

                    })

                }

            </div>

        </div>

    );

}