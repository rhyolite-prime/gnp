

export const useGnpAdminUserAuthIdentity = () => {
  
  const gnpAdminUserIdentityCookie = useCookie("gnp-admin-user-identity");

  return useState("gnpAdminUserAuth", () => gnpAdminUserIdentityCookie.value as string);
};