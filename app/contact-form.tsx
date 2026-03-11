import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
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

export default function ContactFormScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [concern, setConcern] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !phone || !concern) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    // TODO: send contact form
    Alert.alert("Submitted", "We will reach out to you ASAP!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Contact Form</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-between">
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Name */}
            <View className="mt-6">
              <Text className="text-neutral-400 text-sm mb-2">Name</Text>
              <TextInput
                className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
                placeholderTextColor="#555"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View className="mt-5">
              <Text className="text-neutral-400 text-sm mb-2">
                Email Address
              </Text>
              <TextInput
                className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
                placeholderTextColor="#555"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Phone */}
            <View className="mt-5">
              <Text className="text-neutral-400 text-sm mb-2">
                Phone Number
              </Text>
              <TextInput
                className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
                placeholderTextColor="#555"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            {/* Concern */}
            <View className="mt-5">
              <Text className="text-neutral-400 text-sm mb-2">
                Enter your Concern
              </Text>
              <TextInput
                className="bg-neutral-700 rounded-xl px-4 py-3.5 text-white text-base"
                placeholderTextColor="#555"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={{ minHeight: 140 }}
                value={concern}
                onChangeText={setConcern}
              />
            </View>

            {/* Note */}
            <Text className="text-neutral-500 text-xs text-center mt-4">
              We will reach out to you ASAP!
            </Text>
          </ScrollView>

          {/* Buttons */}
          <View className="px-5 pb-10">
            <LinearGradient
              colors={[...GRADIENT_COLORS]}
              locations={[...GRADIENT_LOCATIONS]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ borderRadius: 28, padding: 2 }}
            >
              <TouchableOpacity
                className="rounded-full items-center py-4 bg-neutral-950"
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text className="text-white text-base font-semibold">
                  Submit
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
