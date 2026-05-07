import { api } from "@/lib/api";
import { clearAuthToken, getAuthToken } from "@/lib/session";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function LogoutScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    clearAuthToken();

    if (token) {
      void api.post(`/auth/logout/?token=${encodeURIComponent(token)}`, undefined, false).catch(
        () => {
          // Ignore server-side logout failures; local logout is already complete.
        },
      );
    }

    setReady(true);
  }, []);

  if (!ready) return null;
  return <Redirect href="/(auth)/landing" />;
}