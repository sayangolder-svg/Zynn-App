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

export default function InstagramScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const handleContinue = () => {
    if (username.trim().length > 0) {
      router.push({
        pathname: "/instagram-otp",
        params: { username: username.trim() },
      });
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
              Verify via Instagram
            </Text>

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
              We'll send a 6 digit code to your instagram DM
            </Text>
          </View>

          {/* Privacy Note */}
          <Text className="text-neutral-500 text-xs text-center mb-8">
            We don't ask for your password
          </Text>

          {/* Continue Button */}
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
            >
              <Text className="text-white text-base font-semibold">
                Continue
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
