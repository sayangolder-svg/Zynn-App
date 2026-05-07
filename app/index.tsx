import { api } from "@/lib/api";
import { clearAuthToken, getAuthToken } from "@/lib/session";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [target, setTarget] = useState<"/(tabs)" | "/(auth)/landing" | null>(null);

  useEffect(() => {
    let mounted = true;

    async function resolveRoute() {
      const token = getAuthToken();
      if (!token) {
        if (mounted) setTarget("/(auth)/landing");
        return;
      }

      try {
        await api.get("/profile/");
        if (mounted) setTarget("/(tabs)");
      } catch {
        clearAuthToken();
        if (mounted) setTarget("/(auth)/landing");
      }
    }

    resolveRoute();
    return () => {
      mounted = false;
    };
  }, []);

  if (!target) return null;
  return <Redirect href={target} />;
}
