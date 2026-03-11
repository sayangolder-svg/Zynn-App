import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationType = "earning" | "order" | "campaign" | "system" | "payout";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "earning",
    title: "New Earning",
    message: "You earned ₹245 from your GRWM: Dewy Base reel.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "order",
    title: "New Order",
    message: "Someone purchased a product through your Lip combo reel.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "payout",
    title: "Payout Processed",
    message: "₹5,200 has been credited to your bank account ending in 4521.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "campaign",
    title: "Campaign Live",
    message: "Your reel 'Best drugstore SPF' is now live and earning.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Welcome to Zynn AI",
    message:
      "Your account is all set up! Start adding reels to earn commissions.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "6",
    type: "earning",
    title: "Weekly Summary",
    message: "You earned ₹1,450 this week across 3 reels. Keep it up!",
    time: "3 days ago",
    read: true,
  },
];

function getNotificationIcon(
  type: NotificationType,
): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case "earning":
      return "trending-up";
    case "order":
      return "cart-outline";
    case "campaign":
      return "videocam-outline";
    case "payout":
      return "wallet-outline";
    case "system":
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
    case "system":
      return "#a78bfa";
  }
}

export default function NotificationsScreen() {
  const router = useRouter();

  const unread = NOTIFICATIONS.filter((n) => !n.read);
  const read = NOTIFICATIONS.filter((n) => n.read);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
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
        {/* Unread */}
        {unread.length > 0 && (
          <>
            <Text className="text-neutral-500 text-xs uppercase tracking-wider mt-4 mb-3">
              New
            </Text>
            {unread.map((notification) => (
              <View
                key={notification.id}
                className="bg-neutral-900 rounded-2xl p-4 flex-row items-start mb-3"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor:
                      getNotificationColor(notification.type) + "20",
                  }}
                >
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type)}
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-white text-sm font-semibold">
                      {notification.title}
                    </Text>
                    <View className="w-2 h-2 rounded-full bg-amber-500" />
                  </View>
                  <Text className="text-neutral-400 text-sm leading-5">
                    {notification.message}
                  </Text>
                  <Text className="text-neutral-600 text-xs mt-1.5">
                    {notification.time}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Read */}
        {read.length > 0 && (
          <>
            <Text className="text-neutral-500 text-xs uppercase tracking-wider mt-5 mb-3">
              Earlier
            </Text>
            {read.map((notification) => (
              <View
                key={notification.id}
                className="bg-neutral-900/60 rounded-2xl p-4 flex-row items-start mb-3"
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor:
                      getNotificationColor(notification.type) + "15",
                  }}
                >
                  <Ionicons
                    name={getNotificationIcon(notification.type)}
                    size={20}
                    color={getNotificationColor(notification.type) + "99"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-neutral-400 text-sm font-semibold mb-1">
                    {notification.title}
                  </Text>
                  <Text className="text-neutral-500 text-sm leading-5">
                    {notification.message}
                  </Text>
                  <Text className="text-neutral-600 text-xs mt-1.5">
                    {notification.time}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {NOTIFICATIONS.length === 0 && (
          <View className="flex-1 items-center justify-center pt-32">
            <Ionicons name="notifications-off-outline" size={48} color="#555" />
            <Text className="text-neutral-500 text-base mt-4">
              No notifications yet
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
