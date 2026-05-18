import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

// Internal libs
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/session";

// Google Sign-In
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

export default function LandingScreen() {
  const router = useRouter();

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [debugToast, setDebugToast] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,

      iosClientId:
        process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,

      offlineAccess: false,

      profileImageSize: 120,
    });

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Debug Toast
  const showDebugToast = (message: string) => {
    console.log(`[GoogleSignIn] ${message}`);

    setDebugToast(message);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setDebugToast("");
    }, 2500);
  };

  // Google Login
  const handleGoogleSignIn = async () => {
    if (isSyncing) return;

    try {
      setIsSyncing(true);

      showDebugToast("Checking Google Play Services...");

      // Android only
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      showDebugToast("Opening Google Sign-In...");

      const response = await GoogleSignin.signIn();

      // New API Response Handling
      if (!isSuccessResponse(response)) {
        showDebugToast("Google Sign-In cancelled");
        return;
      }

      const { idToken, user } = response.data;

      if (!idToken) {
        Alert.alert(
          "Authentication Error",
          "No ID token received from Google."
        );
        return;
      }

      showDebugToast("Authenticating with backend...");

      // Backend Authentication
      const auth = await api.post<{
        token: string;
        needs_instagram_verification?: boolean;
      }>(
        "/auth/google/",
        {
          id_token: idToken,
          email: user.email,
          name: user.name,
        },
        false
      );

      // Save JWT Token
      await setAuthToken(auth.token);

      showDebugToast("Login successful");

      // Navigation
      if (auth.needs_instagram_verification) {
        router.replace("/(auth)/instagram");
      } else {
        router.replace("/(tabs)");
      }

    } catch (error: any) {
      console.error(
        "[Google Sign-In Error]",
        JSON.stringify(error, null, 2)
      );

      if (
        error.code === statusCodes.IN_PROGRESS
      ) {
        Alert.alert(
          "Google Sign-In",
          "Sign-In already in progress."
        );

      } else if (
        error.code ===
        statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        Alert.alert(
          "Google Play Services",
          "Google Play Services are unavailable or outdated."
        );

      } else {
        Alert.alert(
          "Google Sign-In Failed",
          error?.message ||
            "Something went wrong during authentication."
        );
      }

    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-black"
      edges={["top", "left", "right"]}
    >
      {/* Debug Toast */}
      {debugToast ? (
        <View className="absolute top-12 left-4 right-4 z-50 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
          <Text className="text-center text-sm font-medium text-white">
            {debugToast}
          </Text>
        </View>
      ) : null}

      {/* Main Content */}
      <View className="flex-1 items-center justify-end px-8 pb-10">
        <Text className="mb-12 text-center text-4xl font-bold text-white">
          Monetize Your{"\n"}Influence.
        </Text>

        <View className="w-full gap-4">

          {/* Apple Login
          <TouchableOpacity
            className="w-full flex-row items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900/50 py-4"
            activeOpacity={0.8}
          >
            <Ionicons
              name="logo-apple"
              size={20}
              color="white"
            />

            <Text className="ml-3 text-base font-medium text-white">
              Continue with Apple
            </Text>
          </TouchableOpacity>
          */}

          {/* Google Login */}
          <TouchableOpacity
            className={`w-full flex-row items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900/50 py-4 ${
              isSyncing ? "opacity-50" : ""
            }`}
            onPress={handleGoogleSignIn}
            disabled={isSyncing}
            activeOpacity={0.8}
          >
            <Image
              source={require("../../assets/images/google.png")}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />

            <Text className="ml-3 text-base font-medium text-white">
              {isSyncing
                ? "Signing in..."
                : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          {/* Email Login */}
          <TouchableOpacity
            className="w-full flex-row items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900/50 py-4"
            onPress={() => router.push("/phone")}
            activeOpacity={0.8}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color="white"
            />

            <Text className="ml-3 text-base font-medium text-white">
              Continue with Email
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Image */}
      <MaskedView
        style={{
          height: 200,
          width: "100%",
        }}
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
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
      </MaskedView>
    </SafeAreaView>
  );
}