import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          // TODO: clear session & navigate to auth
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    router.push("/delete-account" as any);
  };

  const items: SettingsItem[] = [
    {
      icon: "logo-instagram",
      label: "Instagram account",
      onPress: () => router.push("/instagram-accounts" as any),
    },
    {
      icon: "call-outline",
      label: "Change Phone number",
      onPress: () => router.push("/change-phone" as any),
    },
    {
      icon: "card-outline",
      label: "Payment policy",
      onPress: () => router.push("/payment-policy" as any),
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy policy",
      onPress: () => router.push("/privacy-policy" as any),
    },
    {
      icon: "chatbox-ellipses-outline",
      label: "Contact Us",
      onPress: () => router.push("/contact-form" as any),
    },
    {
      icon: "log-out-outline",
      label: "Log out",
      onPress: handleLogout,
    },
    {
      icon: "trash-outline",
      label: "Delete account",
      onPress: () => router.push("/delete-account" as any),
      danger: true,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Settings</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700"
          onPress={() => router.push("/notifications" as any)}
        >
          <Ionicons name="notifications-outline" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View className="bg-neutral-900 rounded-2xl items-center py-6 mt-3">
          <View className="w-20 h-20 rounded-full bg-neutral-600 items-center justify-center mb-3">
            <Text className="text-white text-2xl font-bold">XY</Text>
          </View>
          <Text className="text-white text-base font-bold">HELLO XYZ</Text>
          <Text className="text-neutral-500 text-sm mt-0.5">xyz@gmail.com</Text>
        </View>

        {/* Menu Items */}
        <View className="mt-6">
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center py-4"
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={item.danger ? "#f87171" : "#fff"}
              />
              <Text
                className={`ml-4 text-base ${item.danger ? "text-red-400" : "text-white"}`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
