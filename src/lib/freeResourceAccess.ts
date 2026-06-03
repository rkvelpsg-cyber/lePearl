export const REGISTRATION_UNLOCK_KEY = "lepearl-registration-submitted";
export const FREE_RESOURCE_ACCESS_KEY = "lepearl-free-resource-access";

export function hasFreeResourceAccess() {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.localStorage.getItem(REGISTRATION_UNLOCK_KEY) ||
    window.localStorage.getItem(FREE_RESOURCE_ACCESS_KEY),
  );
}

export function markFreeResourceAccess(payload: {
  submittedAt: string;
  email: string;
  phone: string;
}) {
  if (typeof window === "undefined") return;
  const value = JSON.stringify(payload);
  window.localStorage.setItem(REGISTRATION_UNLOCK_KEY, value);
  window.localStorage.setItem(FREE_RESOURCE_ACCESS_KEY, value);
}
