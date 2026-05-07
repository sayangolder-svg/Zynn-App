let authToken = "";
const TOKEN_KEY = "zynn_auth_token";

function readTokenFromStorage() {
  if (typeof window === "undefined" || !window.localStorage) return "";
  try {
    return window.localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function writeTokenToStorage(token: string) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export function setAuthToken(token: string) {
  authToken = token;
  writeTokenToStorage(token);
  console.log("[AUTH] Token saved:", token ? `${token.length} chars` : "CLEARED");
}

export function getAuthToken() {
  if (!authToken) {
    authToken = readTokenFromStorage();
    console.log("[AUTH] Retrieved from storage:", authToken ? `token exists (${authToken.length} chars)` : "NO TOKEN");
  } else {
    console.log("[AUTH] Using cached token:", `${authToken.length} chars`);
  }
  return authToken;
}

export function clearAuthToken() {
  authToken = "";
  writeTokenToStorage("");
}
