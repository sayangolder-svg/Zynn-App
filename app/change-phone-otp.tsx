import { useAlert } from "@/components/app-alert";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

export default function ChangePhoneOtpScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { phone } = useLocalSearchParams<{ phone: string }>();
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

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH || !phone) return;
    setLoading(true);
    api
      .post("/profile/change-phone/verify/", { phone, otp: code })
      .then(() => {
        showAlert("Success", "Phone number changed successfully.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      })
      .catch((error: unknown) => {
        showAlert(
          "Error",
          error instanceof Error ? error.message : "Failed to verify OTP",
        );
      })
      .finally(() => setLoading(false));
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      try {
        if (!phone) return;
        await api.post("/profile/change-phone/start/", { phone });
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
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">
          Change Phone Number
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-between px-5">
          {/* Form */}
          <View className="mt-10">
            {/* Phone display */}
            <Text className="text-neutral-400 text-sm mb-2">
              Enter new phone number
            </Text>
            <View className="bg-neutral-800 rounded-xl px-4 py-3.5 mb-5">
              <Text className="text-white text-base">{phone}</Text>
            </View>

            {/* OTP Inputs */}
            <View className="flex-row justify-center gap-3 mb-3">
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

            {/* Labels row */}
            <View className="flex-row justify-between px-1">
              <Text className="text-neutral-500 text-sm">Enter OTP</Text>
              <TouchableOpacity onPress={handleResend}>
                <Text
                  className={`text-sm font-medium underline ${
                    resendTimer === 0 ? "text-neutral-300" : "text-neutral-500"
                  }`}
                >
                  Resend OTP
                  {resendTimer > 0 ? ` (${resendTimer}s)` : ""}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <View className="pb-10">
            <LinearGradient
              colors={[...GRADIENT_COLORS]}
              locations={[...GRADIENT_LOCATIONS]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ borderRadius: 28, padding: 2 }}
            >
              <TouchableOpacity
                className="rounded-full items-center justify-center py-4 bg-neutral-950 flex-row gap-2"
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
                <Text className="text-white text-base font-semibold">
                  {loading ? "Submitting..." : "Submit OTP"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
              className="mt-3 items-center py-3"
              onPress={() => router.back()}
            >
              <Text className="text-neutral-400 text-base">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
