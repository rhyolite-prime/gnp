

export const useGnpUserAuthIdentity = () => {
  const gnpUserIdentityCookie = useCookie("gnp-user-identity");
  const state = useState("gnpUserAuth", () => gnpUserIdentityCookie.value as string);
  
  if (import.meta.client) {
    state.value = gnpUserIdentityCookie.value as string;
  }
  
  return state;
};