import DashboardLayout from "../layouts/DashboardLayout";

import MissionBanner from "../components/dashboard/panels/MissionPanels";
import BusinessHealth from "../components/dashboard/BusinessHealth";
import ExecutiveRecommendation from "../components/dashboard/ExecutiveRecommendation";
import MarketplaceHighlights from "../components/dashboard/MarketplaceHighlights";
import RecentBusinessActivity from "../components/dashboard/RecentBusinessActivity";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {

  return (

    <DashboardLayout>

      <div className="space-y-8">

        <MissionBanner />

        <BusinessHealth />

        <ExecutiveRecommendation />

        <MarketplaceHighlights />

        <RecentBusinessActivity />

        <QuickActions />

      </div>

    </DashboardLayout>

  );

}