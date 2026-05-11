import MaskedView from "@react-native-masked-view/masked-view";
import { api } from "@/lib/api";
import { getAuthToken } from "@/lib/session";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

const FLASK_API_BASE_URL = process.env.EXPO_PUBLIC_FLASK_API_BASE_URL || "http://127.0.0.1:5000/api";
const INSTAGRAM_REDIRECT_URI =
  process.env.EXPO_PUBLIC_INSTAGRAM_REDIRECT_URI ||
  `${FLASK_API_BASE_URL}/auth/instagram/oauth-exchange/`;
const INSTAGRAM_LOGIN_SCOPES = process.env.EXPO_PUBLIC_INSTAGRAM_LOGIN_SCOPES || "instagram_business_basic";

async function postFlaskJson<T>(path: string, body: unknown): Promise<T> {
  const token = await getAuthToken();
  const requestUrl =
    Platform.OS === "web" && token
      ? `${FLASK_API_BASE_URL}${path}${path.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`
      : `${FLASK_API_BASE_URL}${path}`;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(Platform.OS !== "web" && token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.detail || data?.message || text || "Instagram connect failed";
    throw new Error(message);
  }

  return data as T;
}

export default function InstagramScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [oauthStatus, setOauthStatus] = useState("");

  const handleContinue = async () => {
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) return;
    try {
      setLoading(true);
      const response = await api.post<{ otp_debug?: string; email?: string }>("/auth/instagram/start/", {
        username: cleanUsername,
      });
      if (response?.otp_debug) {
        Alert.alert("Dev OTP", `Code sent to ${response.email || "your email"}: ${response.otp_debug}`);
      }
      router.push({
        pathname: "/instagram-otp",
        params: { username: cleanUsername },
      });
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthConnect = async () => {
    setOauthStatus("Starting Instagram login...");
    setOauthLoading(true);
    try {
      const CLIENT_ID = "1110909067751504";
      const redirectUri = INSTAGRAM_REDIRECT_URI;
      const token = await getAuthToken();
      const stateParam = token ? `&state=${encodeURIComponent(token)}` : "";
      const authUrl =
        `https://www.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
          redirectUri,
        )}&scope=${encodeURIComponent(INSTAGRAM_LOGIN_SCOPES)}&response_type=code${stateParam}`;

      console.log("[InstagramOAuth] opening auth session", { redirectUri, authUrl });
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      console.log("[InstagramOAuth] result:", result);
      setOauthStatus("Instagram login response received.");

      if (result.type === "success" && result.url) {
        const callbackUrl = new URL(result.url);
        const code = callbackUrl.searchParams.get("code");
        const error = callbackUrl.searchParams.get("error");
        const errorDescription = callbackUrl.searchParams.get("error_description");
        if (error) {
          throw new Error(errorDescription || error);
        }
        if (!code) {
          throw new Error("Instagram did not return an authorization code.");
        }
        const resp = await postFlaskJson<any>("/auth/instagram/oauth-exchange/", {
          code,
          redirect_uri: redirectUri,
        });
        Alert.alert("Connected", `@${resp.account.username} connected.`);
        router.replace("/(auth)/landing");
      }
    } catch (error) {
      setOauthStatus(error instanceof Error ? error.message : "Instagram connect failed");
      Alert.alert("Error", error instanceof Error ? error.message : "Instagram connect failed");
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-12">
          {/* Subtitle */}
          <Text className="text-neutral-400 text-sm text-center mb-8 leading-5">
            Verify your account so your reels can{"\n"}earn commision.
          </Text>

          {/* Instagram Card */}
          <View className="bg-neutral-900 rounded-2xl p-6 mb-4">
            <Text className="text-white text-xl font-bold text-center mb-5">
              Verify via Instag
            </Text>

            {Platform.OS === "web" ? (
              <button
                type="button"
                onClick={() => void handleOAuthConnect()}
                disabled={oauthLoading}
                style={{
                  width: "100%",
                  borderRadius: 9999,
                  padding: "16px 20px",
                  background: "#fff",
                  color: "#000",
                  fontWeight: 600,
                  fontSize: 16,
                  border: "none",
                  cursor: oauthLoading ? "not-allowed" : "pointer",
                  marginBottom: 16,
                }}
              >
                {oauthLoading ? "Opening Instagram..." : "Login with Instagram"}
              </button>
            ) : (
              <TouchableOpacity
                className="rounded-full items-center py-4 bg-white mb-4"
                onPress={handleOAuthConnect}
                activeOpacity={0.85}
                disabled={oauthLoading}
              >
                <Text className="text-black text-base font-semibold">
                  {oauthLoading ? "Opening Instagram..." : "Login with Instagram"}
                </Text>
              </TouchableOpacity>
            )}

            {oauthStatus ? (
              <Text className="text-neutral-400 text-xs text-center mb-4">
                {oauthStatus}
              </Text>
            ) : null}

            {/*
            <View className="flex-row items-center mb-4">
              <View className="flex-1 h-px bg-neutral-700" />
              <Text className="text-neutral-500 text-xs mx-3">or use OTP</Text>
              <View className="flex-1 h-px bg-neutral-700" />
            </View>

            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base mb-3"
              placeholder="Enter instagram username"
              placeholderTextColor="#6b7280"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text className="text-neutral-500 text-xs text-center">
              We&apos;ll send a 6 digit code to your email
            </Text>
            */}
          </View>

          {/* Privacy Note */}
          <Text className="text-neutral-500 text-xs text-center mb-8">
            We don&apos;t ask for your password
          </Text>

          {/* Continue Button */}
          {/*
          <LinearGradient
            colors={[
              "#FB812F",
              "#FD963A",
              "#F4B85E",
              "#CEBE8D",
              "#BBBE9F",
              "#A1B4C1",
              "#868AC4",
            ]}
            locations={[0, 0.16, 0.31, 0.44, 0.53, 0.69, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ borderRadius: 28, padding: 2 }}
          >
            <TouchableOpacity
              className="rounded-full items-center py-4 bg-neutral-950"
              onPress={handleContinue}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text className="text-white text-base font-semibold">
                {loading ? "Sending..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          */}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
