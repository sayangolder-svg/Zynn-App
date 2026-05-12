import { AlertProvider } from "@/components/app-alert";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import "../global.css";

SystemUI.setBackgroundColorAsync("#000");

export default function RootLayout() {
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
