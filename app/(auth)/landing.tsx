import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
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

          <TouchableOpacity className="w-full flex-row items-center justify-center py-4 rounded-xl border border-neutral-700 bg-neutral-900/50">
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
            <Ionicons name="call-outline" size={20} color="white" />
            <Text className="text-white text-base font-medium ml-3">
              Continue with Phone
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
