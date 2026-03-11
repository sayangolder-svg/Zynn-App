import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
      router.push({
        pathname: "/(auth)/phone-otp",
        params: { phone: `${countryCode}${phoneNumber}` },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Main Content */}
        <View className="flex-1 px-6 pt-12">
          {/* Title */}
          <Text className="text-white text-2xl font-bold text-center mb-10">
            Create/Log in Account
          </Text>

          {/* Phone Input Card */}
          <View className="bg-neutral-900 rounded-2xl p-5 mb-8">
            <Text className="text-neutral-400 text-sm mb-3">Phone number</Text>
            <View className="flex-row items-center bg-neutral-800 rounded-xl px-4 py-3">
              {/* Country Code */}
              <TouchableOpacity className="flex-row items-center mr-3">
                <Text className="text-white text-base">{countryCode}</Text>
                <Text className="text-neutral-400 text-xs ml-1">▼</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="w-px h-5 bg-neutral-600 mr-3" />

              {/* Phone Input */}
              <TextInput
                className="flex-1 text-white text-base"
                placeholder="Enter phone number"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={15}
              />
            </View>
          </View>

          {/* Send OTP Button */}
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
            >
              <Text className="text-white text-base font-semibold">
                Send OTP
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
            source={require("../../assets/images/zynn-ai.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </MaskedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
