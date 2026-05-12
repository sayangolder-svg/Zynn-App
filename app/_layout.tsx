import { AlertProvider } from "@/components/app-alert";
import { injectCuelinksScript } from "@/lib/affiliate";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import "../global.css";

SystemUI.setBackgroundColorAsync("#000");

export default function RootLayout() {
  useEffect(() => {
    injectCuelinksScript(process.env.EXPO_PUBLIC_CUELINKS_CID || "267168");
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AlertProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000" },
            animation: "slide_from_right",
          }}
        />
      </AlertProvider>
    </>
  );
}
