import { getAuthToken } from "@/lib/session";
import { Platform } from "react-native";

const IS_WEB = Platform.OS === "web";
const API_BASE_URL =
  (IS_WEB
    ? process.env.EXPO_PUBLIC_API_BASE_URL_WEB
    : process.env.EXPO_PUBLIC_API_BASE_URL) ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
    this.status = status;
  }
}

function toQuery(params?: Record<string, string | number | undefined>) {
  if (!params) return "";
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) q.append(k, String(v));
  });
  const qs = q.toString();
  return qs ? `?${qs}` : "";
}

export async function apiRequest<T>(
  path: string,
  options?: RequestInit & { auth?: boolean },
): Promise<T> {
  const { auth = true, headers, ...rest } = options ?? {};
  const token = getAuthToken();
  const hasBody = rest.body !== undefined && rest.body !== null;
  const requestUrl = `${API_BASE_URL}${path}`;
  const authHeader = auth && token ? { Authorization: `Token ${token}` } : {};
  
  console.log(`[API] ${rest.method || "GET"} ${path}`, {
    auth,
    hasToken: !!token,
    hasAuthHeader: !!authHeader.Authorization,
  });

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      ...rest,
      headers: {
        ...(hasBody ? { "Content-Type": IS_WEB ? "text/plain;charset=UTF-8" : "application/json" } : {}),
        ...authHeader,
        ...headers,
      },
    });
  } catch {
    throw new ApiError(
      "Cannot reach API server. Set EXPO_PUBLIC_API_BASE_URL to your backend URL.",
      0,
    );
  }

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!response.ok) {
    const isReelProcessPath = path.includes("/app/reels/process/");
    if (response.status === 400 && isReelProcessPath) {
      const reelLinkError = Array.isArray(data?.reel_link)
        ? data.reel_link[0]
        : data?.reel_link;
      const rawMessage =
        data?.detail ||
        data?.message ||
        reelLinkError ||
        (typeof text === "string" && text.trim() ? text.trim() : null) ||
        "This reel cannot be processed.";
      throw new ApiError(rawMessage, response.status);
    }
    const reelLinkError = Array.isArray(data?.reel_link)
      ? data.reel_link[0]
      : data?.reel_link;
    const rawMessage =
      data?.detail ||
      data?.message ||
      reelLinkError ||
      data?.phone?.[0] ||
      data?.username?.[0] ||
      (typeof text === "string" && text.trim() ? text.trim() : null) ||
      "Request failed";
    const normalized = String(rawMessage || "").toLowerCase();
    const isReelOwnershipError =
      normalized.includes("not uploaded by your instagram account") ||
      normalized.includes("reel ownership check failed") ||
      normalized.includes("does not match user's accounts") ||
      normalized.includes("owner verification failed");
    const message = isReelOwnershipError
      ? "Sorry, this reel doesn't seem to be yours. Please check before sharing again."
      : rawMessage;
    throw new ApiError(message, response.status);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    apiRequest<T>(`${path}${toQuery(params)}`, { method: "GET" }),
  post: <T>(path: string, body?: unknown, auth = true) =>
    apiRequest<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      auth,
    }),
  put: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) =>
    apiRequest<T>(path, {
      method: "DELETE",
    }),
};

export { ApiError, API_BASE_URL };
