import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationType = "earning" | "order" | "campaign" | "system" | "payout";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function getNotificationIcon(type: NotificationType): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case "earning":
      return "trending-up";
    case "order":
      return "cart-outline";
    case "campaign":
      return "videocam-outline";
    case "payout":
      return "wallet-outline";
    default:
      return "information-circle-outline";
  }
}

function getNotificationColor(type: NotificationType): string {
  switch (type) {
    case "earning":
      return "#34d399";
    case "order":
      return "#fbbf24";
    case "campaign":
      return "#60a5fa";
    case "payout":
      return "#4ade80";
    default:
      return "#a78bfa";
  }
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useFocusEffect(
    useCallback(() => {
      api.get<Notification[]>("/notifications/").then(setNotifications).catch(() => {});
    }, []),
  );

  const unread = notifications.filter((n) => !n.is_read);
  const read = notifications.filter((n) => n.is_read);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {unread.length > 0 && (
          <>
            <Text className="text-neutral-500 text-xs uppercase tracking-wider mt-4 mb-3">New</Text>
            {unread.map((notification) => (
              <View
                key={notification.id}
                className="bg-neutral-900 rounded-2xl p-4 flex-row items-start mb-3"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: getNotificationColor(notification.type) + "20" }}
                >
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-semibold">{notification.title}</Text>
                  <Text className="text-neutral-400 text-sm leading-5">{notification.message}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {read.length > 0 && (
          <>
            <Text className="text-neutral-500 text-xs uppercase tracking-wider mt-5 mb-3">Earlier</Text>
            {read.map((notification) => (
              <View
                key={notification.id}
                className="bg-neutral-900/60 rounded-2xl p-4 flex-row items-start mb-3"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: getNotificationColor(notification.type) + "15" }}
                >
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type) + "99"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-neutral-400 text-sm font-semibold mb-1">{notification.title}</Text>
                  <Text className="text-neutral-500 text-sm leading-5">{notification.message}</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
