import { useAlert } from "@/components/app-alert";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function ChangePhoneScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    const cleanPhone = phone.trim();
    if (!cleanPhone) return;
    try {
      setLoading(true);
      await api.post("/profile/change-phone/start/", { phone: cleanPhone });
      router.push({
        pathname: "/change-phone-otp" as any,
        params: { phone: cleanPhone },
      });
    } catch (error) {
      showAlert(
        "Error",
        error instanceof Error ? error.message : "Failed to send OTP",
      );
    } finally {
      setLoading(false);
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
        {/*
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700"
          onPress={() => router.push("/notifications" as any)}
        >
          <Ionicons name="notifications-outline" size={20} color="#aaa" />
        </TouchableOpacity>
        */}
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-between px-5">
          {/* Form */}
          <View className="mt-10">
            <Text className="text-neutral-400 text-sm mb-2">
              Enter new phone number
            </Text>
            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
              placeholderTextColor="#555"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
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
                onPress={handleSendOtp}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
                <Text className="text-white text-base font-semibold">
                  {loading ? "Sending..." : "Send OTP"}
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
