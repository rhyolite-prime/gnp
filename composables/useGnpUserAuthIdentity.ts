import type { GnpUserAuthModel } from "~/models";

export const useGnpUserAuthIdentity = () => {
  
  const gnpUserIdentityCookie = useCookie("gnp-user-identity");

  return useState("gnpAuth", () => gnpUserIdentityCookie.value as string);
};