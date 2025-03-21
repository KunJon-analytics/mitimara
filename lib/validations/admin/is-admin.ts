const ADMINS = ["gshawn"];

export const isAdmin = (username?: string) => {
  if (!username) {
    return false;
  }
  return ADMINS.includes(username);
};
