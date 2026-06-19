

export const useGnpUserAuthIdentity = () => {
  
  const gnpUserIdentityCookie = useCookie("gnp-user-identity");

  return useState("gnpUserAuth", () => gnpUserIdentityCookie.value as string);
};