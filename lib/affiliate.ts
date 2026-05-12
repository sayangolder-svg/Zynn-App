import { Linking, Platform } from "react-native";

declare global {
  interface Window {
    cuelinks?: {
      init?: () => void;
    };
  }
}

export async function openAffiliateLink(url: string): Promise<void> {
  const clean = String(url || "").trim();
  if (!clean) return;

  if (Platform.OS !== "web") {
    const target = buildAffiliateLink(clean);
    await Linking.openURL(target);
    return;
  }

  const doc = window.document;
  const anchor = doc.createElement("a");
  anchor.href = clean;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  doc.body.appendChild(anchor);
  anchor.click();
  doc.body.removeChild(anchor);
}

export function buildAffiliateLink(url: string): string {
  const clean = String(url || "").trim();
  if (!clean) return "";
  const apiBase = (process.env.EXPO_PUBLIC_FLASK_API_BASE_URL || "").replace(/\/+$/, "");
  const bridgeBase =
    (process.env.EXPO_PUBLIC_AFFILIATE_BRIDGE_URL || "").trim() ||
    (apiBase ? `${apiBase}/affiliate/redirect/` : "");
  if (!bridgeBase) return clean;
  return `${bridgeBase}${bridgeBase.includes("?") ? "&" : "?"}url=${encodeURIComponent(clean)}`;
}

export function injectCuelinksScript(cId: string): void {
  if (Platform.OS !== "web") return;
  if (!cId) return;

  const win = window as Window & { __cuelinksLoaded?: boolean };
  if (win.__cuelinksLoaded) return;
  win.__cuelinksLoaded = true;

  const doc = window.document;
  const id = "cuelinks-v2-script";
  if (doc.getElementById(id)) return;

  (window as any).cId = cId;
  const script = doc.createElement("script");
  script.id = id;
  script.type = "text/javascript";
  script.async = true;
  script.src = `${window.location.protocol === "https:" ? "https" : "http"}://cdn0.cuelinks.com/js/cuelinksv2.js`;
  script.onload = () => {
    try {
      window.cuelinks?.init?.();
    } catch {
      // no-op
    }
  };
  doc.body.appendChild(script);
}
