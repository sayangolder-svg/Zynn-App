import Skeleton from "@/components/skeleton";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { clearAuthToken } from "@/lib/session";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [name, setName] = useState("HELLO XYZ");
  const [email, setEmail] = useState("xyz@gmail.com");
  const [profileLoading, setProfileLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setProfileLoading(true);
      api
        .get<{ name: string; email: string }>("/profile/")
        .then((data) => {
          if (!active) return;
          setName(data.name || "HELLO XYZ");
          setEmail(data.email || "No email");
        })
        .catch(() => {})
        .finally(() => {
          if (active) setProfileLoading(false);
        });

      return () => {
        active = false;
      };
    }, []),
  );

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setShowLogoutModal(false);
    try {
      await api.post("/auth/logout/");
    } catch {
      // ignore logout errors
    } finally {
      await clearAuthToken();
      setIsLoggingOut(false);
      router.replace("/(auth)/landing" as any);
    }
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
        {/*
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700"
          onPress={() => router.push("/notifications" as any)}
        >
          <Ionicons name="notifications-outline" size={20} color="#aaa" />
        </TouchableOpacity>
        */}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        {profileLoading ? (
          <View className="bg-neutral-900 rounded-2xl items-center py-6 mt-3">
            <Skeleton className="w-20 h-20 rounded-full mb-3" />
            <Skeleton className="w-28 h-4 rounded-md" />
            <Skeleton className="w-40 h-3 rounded-md mt-2" />
          </View>
        ) : (
          <View className="bg-neutral-900 rounded-2xl items-center py-6 mt-3">
            <View className="w-20 h-20 rounded-full bg-neutral-600 items-center justify-center mb-3">
              <Text className="text-white text-2xl font-bold">
                {name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text className="text-white text-base font-bold">{name}</Text>
            <Text className="text-neutral-500 text-sm mt-0.5">{email}</Text>
          </View>
        )}

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

      <Modal
        animationType="fade"
        transparent
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          <Pressable
            className="absolute inset-0"
            onPress={() => setShowLogoutModal(false)}
          />
          <View className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 px-5 pt-5 pb-4">
            <Text className="text-white text-lg font-semibold">Log out</Text>
            <Text className="text-neutral-400 text-sm mt-1.5">
              You will need to sign in again to access your account.
            </Text>
            <View className="flex-row gap-3 mt-5">
              <TouchableOpacity
                className="flex-1 h-11 rounded-full border border-neutral-700 items-center justify-center"
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text className="text-white text-sm font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 h-11 rounded-full bg-white items-center justify-center"
                onPress={confirmLogout}
                activeOpacity={0.7}
              >
                <Text className="text-black text-sm font-semibold">Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={isLoggingOut}>
        <View className="flex-1 bg-black/80 items-center justify-center">
          <View className="items-center">
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="text-neutral-300 text-xs mt-3">Signing out…</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
