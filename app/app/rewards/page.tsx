import RewardLinks from "./_components/reward-links";

export default function RewardsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 mb-16">
      <h1 className="text-3xl font-bold">Your Rewards</h1>

      <RewardLinks />
    </div>
  );
}
