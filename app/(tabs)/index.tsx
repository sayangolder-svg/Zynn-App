import Skeleton from "@/components/skeleton";
import StatCard from "@/components/stat-card";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ReelStatus = "Live" | "Draft" | "Paused";

interface ShoppableReel {
  id: number;
  title: string;
  description: string;
  shares: number;
  status: ReelStatus;
  productCount: number;
  thumbnailUrl: string;
}

interface EarningsSummary {
  total_earnings: string;
  bank_accounts: Array<unknown>;
}

function getStatusStyle(status: ReelStatus) {
  switch (status) {
    case "Live":
      return { bg: "bg-green-900/60", text: "text-green-400", dotColor: "#4ade80" };
    case "Draft":
      return { bg: "bg-amber-900/60", text: "text-amber-400", dotColor: "#fbbf24" };
    default:
      return { bg: "bg-red-900/60", text: "text-red-400", dotColor: "#f87171" };
  }
}

function ReelCard({ reel, onPress }: { reel: ShoppableReel; onPress?: () => void }) {
  const statusStyle = getStatusStyle(reel.status);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-neutral-900 rounded-2xl p-4 flex-row items-center mb-3"
    >
      <View className="w-16 h-16 rounded-xl bg-neutral-700 overflow-hidden mr-4">
        {reel.thumbnailUrl ? (
          <Image source={{ uri: reel.thumbnailUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 bg-neutral-600 items-center justify-center">
            <Ionicons name="image-outline" size={24} color="#666" />
          </View>
        )}
      </View>

      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-white text-base font-semibold mr-2" numberOfLines={1}>
            {reel.title}
          </Text>
          <View className={`flex-row items-center rounded-full px-2 py-0.5 ${statusStyle.bg}`}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: statusStyle.dotColor,
                marginRight: 4,
              }}
            />
            <Text className={`text-xs font-medium ${statusStyle.text}`}>{reel.status}</Text>
          </View>
        </View>
        <Text className="text-neutral-400 text-sm mb-1" numberOfLines={2}>
          {reel.description || "No description"}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-amber-500 text-sm font-bold">{reel.shares}</Text>
          <Text className="text-neutral-500 text-xs ml-1">SHARES</Text>
          <Text className="text-neutral-600 text-xs mx-2">|</Text>
          <Text className="text-sky-400 text-sm font-bold">{reel.productCount}</Text>
          <Text className="text-neutral-500 text-xs ml-1">PRODUCTS</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function HomeSkeleton() {
  return (
    <View>
      <View className="flex-row items-center justify-between px-5 mb-2">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </View>

      <View className="px-5 mt-4 mb-4">
        <Skeleton className="w-32 h-7 rounded-lg" />
      </View>

      <View className="flex-row px-5 gap-3 mb-8">
        <Skeleton className="flex-1 h-24 rounded-2xl" />
        <Skeleton className="flex-1 h-24 rounded-2xl" />
        <Skeleton className="flex-1 h-24 rounded-2xl" />
      </View>

      <View className="px-5 mb-4">
        <Skeleton className="w-48 h-6 rounded-lg" />
      </View>

      <View className="px-5">
        {[0, 1, 2].map((idx) => (
          <View
            key={idx}
            className="bg-neutral-900 rounded-2xl p-4 flex-row items-center mb-3"
          >
            <Skeleton className="w-16 h-16 rounded-xl" />
            <View className="flex-1 ml-4">
              <Skeleton className="w-3/4 h-4 rounded-md" />
              <Skeleton className="w-full h-3 rounded-md mt-2" />
              <Skeleton className="w-2/3 h-3 rounded-md mt-2" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [reels, setReels] = useState<ShoppableReel[]>([]);
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const load = async () => {
        setIsLoading(true);
        const [reelResponse, summaryResponse] = await Promise.all([
          api.get<Array<Record<string, unknown>>>("/reels/").catch(() => null),
          api.get<EarningsSummary>("/earnings/summary/").catch(() => null),
        ]);

        if (!active) return;

        if (Array.isArray(reelResponse)) {
          const next: ShoppableReel[] = reelResponse.map((item) => ({
            // Prefer detected product names for display when title/description are generic.
            ...(function () {
              const rawProducts = Array.isArray(item.products) ? item.products : [];
              const productNames = rawProducts
                .map((p) =>
                  typeof p === "object" && p
                    ? String((p as Record<string, unknown>).name || "").trim()
                    : "",
                )
                .filter(Boolean);
              const thumbnailUrl =
                rawProducts
                  .map((p) =>
                    typeof p === "object" && p
                      ? String((p as Record<string, unknown>).image_url || "").trim()
                      : "",
                  )
                  .find(Boolean) || "";
              const rawTitle = String(item.title || "").trim();
              const rawDescription = String(item.description || "").trim();
              const titleIsGeneric = !rawTitle || rawTitle.toLowerCase() === "untitled reel";

              const resolvedTitle = titleIsGeneric
                ? productNames[0] || "Instagram Reel"
                : rawTitle;

              const resolvedDescription =
                rawDescription ||
                (productNames.length > 1
                  ? `Includes ${productNames.length} products: ${productNames.slice(0, 2).join(", ")}`
                  : productNames[0]
                    ? `Detected product: ${productNames[0]}`
                    : "");

              return {
                title: resolvedTitle,
                description: resolvedDescription,
                productCount: productNames.length,
                thumbnailUrl,
              };
            })(),
            id: Number(item.id),
            shares: Number(item.shares || 0),
            status: String(item.status || "Draft") as ReelStatus,
          }));
          setReels(next);
        }

        if (summaryResponse) {
          setSummary(summaryResponse);
        }

        setIsLoading(false);
      };

      void load();

      return () => {
        active = false;
      };
    }, []),
  );

  const showSkeleton = isLoading && reels.length === 0 && !summary;

  return (
    <SafeAreaView className="flex-1 bg-black pt-5" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {showSkeleton ? (
          <HomeSkeleton />
        ) : (
          <>
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

            <View className="px-5 mt-4 mb-4">
              <Text className="text-white text-2xl font-bold">Your Reels</Text>
            </View>

            <View className="flex-row px-5 gap-3 mb-8">
              <StatCard
                icon="trending-up"
                label="Earnings"
                value={`Rs ${summary?.total_earnings ?? "0.00"}`}
              />
              <StatCard icon="cart-outline" label="Orders" value={String(reels.length)} />
              <StatCard
                icon="share-outline"
                label="Shares"
                value={String(reels.reduce((a, r) => a + r.shares, 0))}
              />
            </View>

            <View className="px-5 mb-4">
              <Text className="text-white text-lg font-bold">Your Shoppable Reels</Text>
            </View>

            <View className="px-5">
              {reels.map((reel) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  onPress={() =>
                    router.push({
                      pathname: "/campaign-details",
                      params: { reelId: String(reel.id) },
                    })
                  }
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <View className="absolute bottom-6 right-5">
        <LinearGradient
          colors={["#FB812F", "#FD963A", "#F4B85E", "#CEBE8D", "#BBBE9F", "#A1B4C1", "#868AC4"]}
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
