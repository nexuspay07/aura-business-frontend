import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";

import {
  Rocket,
  Target,
  ArrowRight,
  Building2,
  FolderTree,
} from "lucide-react";

export default function MissionBanner() {

  return (

    <Card className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white border-0">

      <div className="flex flex-col lg:flex-row justify-between gap-8">

        {/* LEFT */}

        <div className="flex-1">

          <div className="flex items-center gap-3 mb-6">

            <Badge color="blue">

              Executive Mission

            </Badge>

            <Badge color="green">

              Active

            </Badge>

          </div>

          <h1 className="text-4xl font-bold leading-tight">

            Good Morning, Blaise

          </h1>

          <p className="text-violet-100 mt-3 text-lg">

            Welcome back to Aura Business.

          </p>

          <div className="mt-8">

            <h2 className="text-2xl font-semibold">

              Today's Mission

            </h2>

            <p className="mt-3 text-violet-100 leading-relaxed text-lg">

              Launch Aura Marketplace successfully and
              prepare the platform for early beta customers.

            </p>

          </div>

          <div className="flex gap-4 mt-8">

            <Button>

              Open Intelligence

            </Button>

            <Button variant="secondary">

              View Roadmap

            </Button>

          </div>

        </div>

        {/* RIGHT */}

        <div className="w-full lg:w-[340px]">

          <div className="grid gap-4">

            <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-sm">

              <div className="flex items-center gap-3">

                <Building2 size={22} />

                <div>

                  <p className="text-sm opacity-80">

                    Organization

                  </p>

                  <h3 className="font-semibold text-lg">

                    Aura Group

                  </h3>

                </div>

              </div>

            </div>

            <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-sm">

              <div className="flex items-center gap-3">

                <FolderTree size={22} />

                <div>

                  <p className="text-sm opacity-80">

                    Workspace

                  </p>

                  <h3 className="font-semibold text-lg">

                    Main Workspace

                  </h3>

                </div>

              </div>

            </div>

            <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm opacity-80">

                    Mission Status

                  </p>

                  <h3 className="font-semibold text-lg">

                    In Progress

                  </h3>

                </div>

                <Rocket size={28} />

              </div>

            </div>

            <div className="bg-white/10 rounded-3xl p-5 backdrop-blur-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm opacity-80">

                    Priority

                  </p>

                  <h3 className="font-semibold text-lg">

                    High

                  </h3>

                </div>

                <Target size={28} />

              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">

        <p className="text-violet-100">

          Aura continuously aligns your organization's goals,
          business context and intelligence to help you make
          better decisions.

        </p>

        <button className="flex items-center gap-2 text-white font-semibold">

          Learn More

          <ArrowRight size={18} />

        </button>

      </div>

    </Card>

  );

}