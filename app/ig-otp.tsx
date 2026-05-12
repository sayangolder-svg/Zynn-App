import { useAlert } from "@/components/app-alert";
import MaskedView from "@react-native-masked-view/masked-view";
import { api } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OTP_LENGTH = 6;

const GRADIENT_COLORS = [
  "#FB812F",
  "#FD963A",
  "#F4B85E",
  "#CEBE8D",
  "#BBBE9F",
  "#A1B4C1",
  "#868AC4",
] as const;
const GRADIENT_LOCATIONS = [0, 0.16, 0.31, 0.44, 0.53, 0.69, 1] as const;

export default function IGOtpScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { username } = useLocalSearchParams<{ username: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH || !username) return;
    try {
      setLoading(true);
      await api.post("/auth/instagram/verify/", { username, otp: code });
      router.replace("/instagram-accounts" as any);
    } catch (error) {
      showAlert(
        "Error",
        error instanceof Error ? error.message : "Verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      try {
        if (!username) return;
        const response = await api.post<{ otp_debug?: string; email?: string }>("/auth/instagram/start/", { username });
        if (response?.otp_debug) {
          showAlert(
            "Dev OTP",
            `Code sent to ${response.email || "your email"}: ${response.otp_debug}`,
          );
        }
        setResendTimer(30);
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } catch (error) {
        showAlert(
          "Error",
          error instanceof Error ? error.message : "Failed to resend OTP",
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-12">
          {/* Title */}
          <Text className="text-white text-xl font-bold text-center mb-2">
            Verify via Instagram
          </Text>

          <Text className="text-neutral-400 text-sm text-center mb-8 leading-5">
            Enter the 6 digit code sent to your{"\n"}email
          </Text>

          {/* OTP Inputs */}
          <View className="flex-row justify-center gap-3 mb-4">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                className="w-12 h-14 bg-neutral-800 rounded-lg text-white text-xl text-center"
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Divider */}
          <View className="h-px bg-neutral-700 mx-2 mb-6" />

          {/* Resend */}
          <View className="flex-row justify-center mb-10">
            <Text className="text-neutral-500 text-sm">
              Didn&apos;t receive code?{" "}
            </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text
                className={`text-sm font-medium underline ${
                  resendTimer === 0 ? "text-neutral-300" : "text-neutral-500"
                }`}
              >
                RESEND OTP
                {resendTimer > 0 ? ` (${resendTimer}s)` : ""}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <LinearGradient
            colors={[...GRADIENT_COLORS]}
            locations={[...GRADIENT_LOCATIONS]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ borderRadius: 28, padding: 2 }}
          >
            <TouchableOpacity
              className="rounded-full items-center justify-center py-4 bg-neutral-950 flex-row gap-2"
              onPress={handleVerify}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
              <Text className="text-white text-base font-semibold">
                {loading ? "Verifying..." : "Verify and continue"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
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
            source={require("../assets/images/zynn-ai.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </MaskedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
