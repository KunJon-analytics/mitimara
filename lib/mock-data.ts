export const mockTreeData = {
  id: "tree_123456",
  code: "abc123",
  additionalInfo: "This is a beautiful oak tree.",
  latitude: 40.7128,
  longitude: -74.006,
  isAuthentic: true,
  rewardClaimed: false,
  dateVerified: new Date("2023-06-15"),
  planterId: "user_789012",
  createdAt: new Date("2023-05-01"),
  updatedAt: new Date("2023-06-15"),
  planter: {
    id: "user_789012",
    username: "EcoWarrior",
    accessToken: "mock_access_token",
    uid: "mock_uid",
    isActive: true,
    points: 150,
    referrer: null,
    noOfReferrals: 3,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-06-15"),
  },
  mediaEvidence: [
    {
      id: "media_1",
      type: "VIDEO" as const,
      url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    },
  ],
  verifications: [
    {
      id: "verification_1",
      verifier: {
        id: "user_345678",
        username: "GreenThumb",
      },
      createdAt: new Date("2023-05-15"),
      dateUpdated: new Date("2023-05-15"),
      rewardClaimed: true,
    },
    {
      id: "verification_2",
      verifier: {
        id: "user_901234",
        username: "NatureGuardian",
      },
      createdAt: new Date("2023-06-01"),
      dateUpdated: new Date("2023-06-01"),
      rewardClaimed: false,
    },
    {
      id: "verification_3",
      verifier: {
        id: "user_567890",
        username: "EarthProtector",
      },
      createdAt: new Date("2023-06-15"),
      dateUpdated: new Date("2023-06-15"),
      rewardClaimed: false,
    },
  ],
};
