
export const useGnpAffiliateUserAuthIdentity = () => {
  
  const affiliateIdentityCookie = useCookie("gnp-affiliate-user-identity");

  return useState("affiliateAuth", () => affiliateIdentityCookie.value as string);
};