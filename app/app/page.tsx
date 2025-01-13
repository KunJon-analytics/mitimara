import ProfileStats from "./_components/profile-stats";
import DashboardLinks from "./_components/dashboard-links";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <ProfileStats />

      <DashboardLinks />
    </div>
  );
}
