
export const useGnpPartnerUserAuthIdentity = () => {
  
  const partnerUserIdentityCookie = useCookie("gnp-partner-user-identity");

  return useState("partnerAuth", () => partnerUserIdentityCookie.value as string);
};