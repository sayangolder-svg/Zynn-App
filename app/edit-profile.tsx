import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState("HELLO XYZ");
  const [email, setEmail] = useState("xyz@gmail.com");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("+91");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      api
        .get<{ name: string; email: string; bio: string; phone: string }>("/profile/")
        .then((profile) => {
          setName(profile.name || "");
          setEmail(profile.email || "");
          setBio(profile.bio || "");
          setPhone(profile.phone || "");
        })
        .catch(() => {});
    }, []),
  );

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Email cannot be empty.");
      return;
    }
    try {
      setLoading(true);
      await api.put("/profile/", { name: name.trim(), email: email.trim(), bio });
      Alert.alert("Saved", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to update profile");
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
        <Text className="text-white text-lg font-bold">Edit Profile</Text>
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
            {/* Avatar */}
            <View className="items-center mt-6 mb-8">
              <View className="w-24 h-24 rounded-full bg-neutral-600 items-center justify-center mb-3">
                <Text className="text-white text-3xl font-bold">XY</Text>
              </View>
              <TouchableOpacity>
                <Text className="text-amber-500 text-sm font-semibold">
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>

            {/* Name */}
            <View className="mt-2">
              <Text className="text-neutral-400 text-sm mb-2">Full Name</Text>
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

            {/* Bio */}
            <View className="mt-5">
              <Text className="text-neutral-400 text-sm mb-2">Bio</Text>
              <TextInput
                className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
                placeholderTextColor="#555"
                placeholder="Tell us a little about yourself"
                multiline
                numberOfLines={4}
                style={{ minHeight: 100, textAlignVertical: "top" }}
                value={bio}
                onChangeText={setBio}
              />
            </View>

            {/* Phone (read-only) */}
            <View className="mt-5">
              <Text className="text-neutral-400 text-sm mb-2">
                Phone Number
              </Text>
              <View className="bg-neutral-800 rounded-xl px-4 py-3.5 flex-row items-center justify-between">
                <Text className="text-neutral-500 text-base">
                  {phone}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/change-phone" as any)}
                >
                  <Text className="text-amber-500 text-sm font-semibold">
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Instagram (read-only) */}
            <View className="mt-5">
              <Text className="text-neutral-400 text-sm mb-2">
                Instagram Account
              </Text>
              <View className="bg-neutral-800 rounded-xl px-4 py-3.5 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="logo-instagram" size={18} color="#E1306C" />
                  <Text className="text-neutral-500 text-base ml-2">
                    @username
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push("/instagram-accounts" as any)}
                >
                  <Text className="text-amber-500 text-sm font-semibold">
                    Manage
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Save Button */}
          <View className="px-5 pb-8">
            <LinearGradient
              colors={[...GRADIENT_COLORS]}
              locations={[...GRADIENT_LOCATIONS]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ borderRadius: 28, padding: 2 }}
            >
              <TouchableOpacity
                className="rounded-full items-center py-4 bg-neutral-950"
                activeOpacity={0.7}
                onPress={handleSave}
                disabled={loading}
              >
                <Text className="text-white text-base font-semibold">
                  {loading ? "Saving..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
