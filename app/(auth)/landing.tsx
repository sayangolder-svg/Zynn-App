import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/session";
import * as Google from "expo-auth-session/providers/google";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function LandingScreen() {
  const router = useRouter();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debugToast, setDebugToast] = useState("");
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined,
  });

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showDebugToast = (message: string) => {
    console.log(`[GoogleSignIn] ${message}`);
    setDebugToast(message);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => setDebugToast(""), 2200);
  };

  const handleGoogleSignIn = async () => {
    try {
      showDebugToast("Starting Google sign-in");
      const result = await promptAsync();
      console.log("[GoogleSignIn] promptAsync result:", result);
      if (result.type !== "success") return;
      const token =
        result.authentication?.idToken ||
        (result as { params?: { id_token?: string } }).params?.id_token;
      if (!token) {
        showDebugToast("No Google token returned");
        Alert.alert("Error", "Google login did not return a valid token.");
        return;
      }

      showDebugToast("Token received, calling backend");
      console.log("[GoogleSignIn] id_token present, sending to /auth/google/");

      const auth = await api.post<{
        token: string;
        needs_instagram_verification?: boolean;
      }>("/auth/google/", { id_token: token }, false);

      console.log("[GoogleSignIn] backend response:", auth);
      showDebugToast(auth.needs_instagram_verification ? "Redirecting to Instagram verification" : "Redirecting to home");

      setAuthToken(auth.token);
      if (auth.needs_instagram_verification) {
        router.replace("/(auth)/instagram");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Google sign-in failed.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {debugToast ? (
        <View className="absolute top-4 left-4 right-4 z-50 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
          <Text className="text-white text-sm font-medium">{debugToast}</Text>
        </View>
      ) : null}

      {/* Top section */}
      <View className="flex-1 justify-end items-center px-8 pb-10">
        <Text className="text-white text-4xl font-bold text-center mb-12">
          Monetize Your{"\n"}Influence.
        </Text>

        <View className="w-full gap-4">
          <TouchableOpacity className="w-full flex-row items-center justify-center py-4 rounded-xl border border-neutral-700 bg-neutral-900/50">
            <Ionicons name="logo-apple" size={20} color="white" />
            <Text className="text-white text-base font-medium ml-3">
              Continue with Apple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full flex-row items-center justify-center py-4 rounded-xl border border-neutral-700 bg-neutral-900/50"
            onPress={handleGoogleSignIn}
            disabled={!request}
          >
            <Image
              source={require("../../assets/images/google.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="text-white text-base font-medium ml-3">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full flex-row items-center justify-center py-4 rounded-xl border border-neutral-700 bg-neutral-900/50"
            onPress={() => router.push("/phone")}
          >
            <Ionicons name="mail-outline" size={20} color="white" />
            <Text className="text-white text-base font-medium ml-3">
              Continue with Email
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Image with Transparent Top Fade */}
      <MaskedView
        style={{ height: 200, width: "100%" }}
        maskElement={
          <LinearGradient
            colors={["transparent", "black"]}
            locations={[0, 0.5]}
            style={{ flex: 1 }}
          />
        }
      >
        <Image
          source={require("../../assets/images/zynn-ai.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </MaskedView>
    </SafeAreaView>
  );
}
