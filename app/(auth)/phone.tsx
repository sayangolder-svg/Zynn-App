import MaskedView from "@react-native-masked-view/masked-view";
import { api } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/auth/email/start/", { email: cleanEmail }, false);
      router.push({
        pathname: "/(auth)/phone-otp",
        params: { email: cleanEmail },
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to send OTP",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-12">
          <Text className="text-white text-2xl font-bold text-center mb-10">
            Login with Email
          </Text>

          <View className="bg-neutral-900 rounded-2xl p-5 mb-8">
            <Text className="text-neutral-400 text-sm mb-3">Email address</Text>
            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3 text-white text-base"
              placeholder="Enter your email"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

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
              onPress={handleSendOTP}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text className="text-white text-base font-semibold">
                {loading ? "Sending..." : "Send OTP"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

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
