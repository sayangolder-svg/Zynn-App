import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

let authToken = "";
const TOKEN_KEY = "zynn_auth_token";
const IS_WEB = Platform.OS === "web";

async function readTokenFromStorage(): Promise<string> {
  if (IS_WEB) {
    if (typeof window === "undefined" || !window.localStorage) return "";
    try {
      return window.localStorage.getItem(TOKEN_KEY) || "";
    } catch {
      return "";
    }
  }

  try {
    return (await SecureStore.getItemAsync(TOKEN_KEY)) || "";
  } catch {
    return "";
  }
}

async function writeTokenToStorage(token: string): Promise<void> {
  if (IS_WEB) {
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
    return;
  }

  try {
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
      });
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

export async function setAuthToken(token: string): Promise<void> {
  authToken = token;
  await writeTokenToStorage(token);
}

export async function getAuthToken(): Promise<string> {
  if (!authToken) {
    authToken = await readTokenFromStorage();
  }
  return authToken;
}

export async function clearAuthToken(): Promise<void> {
  authToken = "";
  await writeTokenToStorage("");
}
