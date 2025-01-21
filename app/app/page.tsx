import ProfileStats from "./_components/profile-stats";
import LoginModal from "@/components/auth/login-modal";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <ProfileStats />

      <div className="flex justify-center">
        <LoginModal />
      </div>
    </div>
  );
}
