
export const usePartnerAuthIdentity = () => {
  
  const partnerIdentityCookie = useCookie("gnp-partner-identity");

  return useState("partnerAuth", () => partnerIdentityCookie.value as string);
};