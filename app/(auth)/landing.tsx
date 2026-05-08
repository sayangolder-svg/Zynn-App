import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

// Internal Libs
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/session";

// Native Google Sign-In
import { 
  GoogleSignin, 
  statusCodes, 
  GoogleSigninButton 
} from '@react-native-google-signin/google-signin';

export default function LandingScreen() {
  const router = useRouter();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debugToast, setDebugToast] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize Native Google SDK
  useEffect(() => {
    GoogleSignin.configure({
      // Must be a "Web Client ID" from Google Cloud Console
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true, 
    });

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showDebugToast = (message: string) => {
    console.log(`[GoogleSignIn] ${message}`);
    setDebugToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setDebugToast(""), 2500);
  };

  const handleGoogleSignIn = async () => {
    if (isSyncing) return;
    
    try {
      setIsSyncing(true);
      showDebugToast("Opening native Google picker...");
      
      // 1. Check if Play Services are available (Android specific)
      await GoogleSignin.hasPlayServices();
      
      // 2. Trigger the native bottom sheet / login popup
      const response = await GoogleSignin.signIn();
      
      // Note: In version 11+, user data is nested in the 'data' property
      const idToken = response.data?.idToken;

      if (!idToken) {
        showDebugToast("Error: No ID token received.");
        return;
      }

      showDebugToast("Authenticating with Zynn backend...");

      // 3. Send the token to your backend
      const auth = await api.post<{
        token: string;
        needs_instagram_verification?: boolean;
      }>("/auth/google/", { id_token: idToken }, false);

      setAuthToken(auth.token);

      if (auth.needs_instagram_verification) {
        router.replace("/(auth)/instagram");
      } else {
        router.replace("/(tabs)");
      }

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        showDebugToast("Sign-in cancelled by user");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        showDebugToast("Sign-in already in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Google Play Services", "Play Services are required for Google Sign-in on Android.");
      } else {
        console.error("[GoogleSignIn Error]", error);
        Alert.alert("Sign-in Error", error.message || "An unexpected error occurred.");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Toast Notification */}
      {debugToast ? (
        <View className="absolute top-12 left-4 right-4 z-50 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
          <Text className="text-white text-sm font-medium text-center">{debugToast}</Text>
        </View>
      ) : null}

      {/* Hero Section */}
      <View className="flex-1 justify-end items-center px-8 pb-10">
        <Text className="text-white text-4xl font-bold text-center mb-12">
          Monetize Your{"\n"}Influence.
        </Text>

        <View className="w-full gap-4">
          {/* Apple Login */}
          <TouchableOpacity className="w-full flex-row items-center justify-center py-4 rounded-xl border border-neutral-700 bg-neutral-900/50">
            <Ionicons name="logo-apple" size={20} color="white" />
            <Text className="text-white text-base font-medium ml-3">
              Continue with Apple
            </Text>
          </TouchableOpacity>

          {/* Google Login (Native) */}
          <TouchableOpacity
            className={`w-full flex-row items-center justify-center py-4 rounded-xl border border-neutral-700 bg-neutral-900/50 ${isSyncing ? 'opacity-50' : ''}`}
            onPress={handleGoogleSignIn}
            disabled={isSyncing}
          >
            <Image
              source={require("../../assets/images/google.png")}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
            <Text className="text-white text-base font-medium ml-3">
              {isSyncing ? "Signing in..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          {/* Email Login */}
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

      {/* Footer Image with Gradient */}
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