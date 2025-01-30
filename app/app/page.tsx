import LoginModal from "@/components/auth/login-modal";
import ProfileStats from "./_components/profile-stats";
import QuickLinks from "./_components/quick-links";

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6 mb-16">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <ProfileStats />

      <div className="flex justify-center">
        <LoginModal />
      </div>

      <QuickLinks />
    </div>
  );
}
