import StatCard from "@/components/stat-card";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type ReelStatus = "Live" | "Draft" | "Paused";

interface ShoppableReel {
  id: string;
  title: string;
  description: string;
  shares: number;
  status: ReelStatus;
  image?: any;
}

const REELS_DATA: ShoppableReel[] = [
  {
    id: "1",
    title: "GRWM: Dewy Base",
    description: "Doing my base makeup for a dewy, glowy look.",
    shares: 128,
    status: "Live",
    image: null,
  },
  {
    id: "2",
    title: "Lip combo that la...",
    description: "My go-to long-lasting lip combo for all occasions.",
    shares: 64,
    status: "Draft",
  },
  {
    id: "3",
    title: "Best drugsto...",
    description: "My favorite affordable SPF for everyday wear.",
    shares: 19,
    status: "Paused",
    image: null,
  },
];

function getStatusStyle(status: ReelStatus) {
  switch (status) {
    case "Live":
      return {
        bg: "bg-green-900/60",
        text: "text-green-400",
        dotColor: "#4ade80",
      };
    case "Draft":
      return {
        bg: "bg-amber-900/60",
        text: "text-amber-400",
        dotColor: "#fbbf24",
      };
    case "Paused":
      return {
        bg: "bg-red-900/60",
        text: "text-red-400",
        dotColor: "#f87171",
      };
  }
}

// function StatCard({
//   icon,
//   label,
//   value,
// }: {
//   icon: keyof typeof Ionicons.glyphMap;
//   label: string;
//   value: string;
//   iconBg?: string;
// }) {
//   return (
//     <View className="flex-1 bg-neutral-900 rounded-2xl px-3 py-4 items-center">
//       <View className="rounded-full px-3 py-1 mb-2 flex-row items-center bg-neutral-800">
//         <Ionicons name={icon} size={12} color="#fff" />
//         <Text className="text-white text-[10px] font-semibold ml-1 uppercase">
//           {label}
//         </Text>
//       </View>
//       <Text className="text-white text-xl font-bold">{value}</Text>
//     </View>
//   );
// }

function ReelCard({
  reel,
  onPress,
}: {
  reel: ShoppableReel;
  onPress?: () => void;
}) {
  const statusStyle = getStatusStyle(reel.status);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-neutral-900 rounded-2xl p-4 flex-row items-center mb-3"
    >
      {/* Thumbnail */}
      <View className="w-16 h-16 rounded-xl bg-neutral-700 overflow-hidden mr-4">
        <View className="flex-1 bg-neutral-600 items-center justify-center">
          <Ionicons name="image-outline" size={24} color="#666" />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text
            className="text-white text-base font-semibold mr-2"
            numberOfLines={1}
          >
            {reel.title}
          </Text>
          <View
            className={`flex-row items-center rounded-full px-2 py-0.5 ${statusStyle.bg}`}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: statusStyle.dotColor,
                marginRight: 4,
              }}
            />
            <Text className={`text-xs font-medium ${statusStyle.text}`}>
              {reel.status}
            </Text>
          </View>
        </View>
        <Text className="text-neutral-400 text-sm mb-1" numberOfLines={2}>
          {reel.description}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-amber-500 text-sm font-bold">
            {reel.shares}
          </Text>
          <Text className="text-neutral-500 text-xs ml-1">SHARES</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      className="flex-1 bg-black pt-5"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile + Icons Row */}
        <View className="flex-row items-center justify-between px-5 mb-2">
          <View className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700">
            <Ionicons name="person-outline" size={20} color="#aaa" />
          </View>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700"
            onPress={() => router.push("/notifications" as any)}
          >
            <Ionicons name="notifications-outline" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Your Reels Title */}
        <View className="px-5 mt-4 mb-4">
          <Text className="text-white text-2xl font-bold">Your Reels</Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-5 gap-3 mb-8">
          <StatCard icon="trending-up" label="Earnings" value="₹12,450" />
          <StatCard icon="cart-outline" label="Orders" value="34" />
          <StatCard icon="share-outline" label="Shares" value="1,280" />
        </View>

        {/* Your Shoppable Reels */}
        <View className="px-5 mb-4">
          <Text className="text-white text-lg font-bold">
            Your Shoppable Reels
          </Text>
        </View>

        {/* Reel Cards */}
        <View className="px-5">
          {REELS_DATA.map((reel) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              onPress={() =>
                router.push({
                  pathname: "/campaign-details",
                  params: { reelId: reel.id },
                })
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <View className="absolute bottom-6 right-5">
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
            className="w-14 h-14 rounded-full bg-neutral-900 items-center justify-center"
            activeOpacity={0.7}
            onPress={() => router.push("/add-reel")}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}
