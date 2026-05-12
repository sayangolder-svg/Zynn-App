import { useAlert } from "@/components/app-alert";
import Skeleton from "@/components/skeleton";
import StatCard from "@/components/stat-card";
import { Ionicons } from "@expo/vector-icons";
import { openAffiliateLink } from "@/lib/affiliate";
import { api } from "@/lib/api";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ReelStatus = "Live" | "Draft" | "Paused";

interface Product {
  id: number;
  name: string;
  store: string;
  price: string;
  product_link: string;
  image_url?: string;
  affiliated_brands: string[];
}

interface ReelDetails {
  id: number;
  title: string;
  handle: string;
  status: ReelStatus;
  is_active: boolean;
  earnings: string;
  orders: number;
  shares: number;
  clicks: number;
  products: Product[];
}

function getStatusStyle(status: ReelStatus) {
  switch (status) {
    case "Live":
      return { bg: "bg-green-900/60", text: "text-green-400", dotColor: "#4ade80", trackColor: "#4ade80" };
    case "Draft":
      return { bg: "bg-amber-900/60", text: "text-amber-400", dotColor: "#fbbf24", trackColor: "#fbbf24" };
    default:
      return { bg: "bg-yellow-900/60", text: "text-yellow-400", dotColor: "#facc15", trackColor: "#facc15" };
  }
}

function CampaignSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <Skeleton className="w-9 h-9 rounded-full" />
        <Skeleton className="w-40 h-4 rounded-md" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 mt-2 mb-4">
          <Skeleton className="w-16 h-3 rounded-md mb-3" />
          <View className="bg-neutral-900 rounded-2xl p-4 flex-row items-center justify-between">
            <Skeleton className="w-14 h-14 rounded-xl" />
            <View className="flex-1 ml-4">
              <Skeleton className="w-32 h-4 rounded-md" />
              <Skeleton className="w-24 h-3 rounded-md mt-2" />
            </View>
            <Skeleton className="w-10 h-6 rounded-full" />
          </View>
        </View>

        <View className="flex-row px-5 gap-3 mb-6">
          <Skeleton className="flex-1 h-20 rounded-2xl" />
          <Skeleton className="flex-1 h-20 rounded-2xl" />
          <Skeleton className="flex-1 h-20 rounded-2xl" />
        </View>

        <View className="px-5">
          <Skeleton className="w-36 h-3 rounded-md mb-3" />
          {[0, 1, 2].map((idx) => (
            <View key={idx} className="bg-neutral-900 rounded-2xl p-4 mb-3">
              <View className="flex-row items-center">
                <Skeleton className="w-14 h-14 rounded-xl" />
                <View className="flex-1 ml-4">
                  <Skeleton className="w-40 h-4 rounded-md" />
                  <Skeleton className="w-28 h-3 rounded-md mt-2" />
                  <Skeleton className="w-20 h-3 rounded-md mt-2" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function CampaignDetailsScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { reelId } = useLocalSearchParams<{ reelId: string }>();
  const [campaign, setCampaign] = useState<ReelDetails | null>(null);

  const loadCampaign = useCallback(async () => {
    if (!reelId) return;
    try {
      const data = await api.get<ReelDetails>(`/reels/${reelId}/`);
      setCampaign(data);
    } catch {}
  }, [reelId]);

  useFocusEffect(
    useCallback(() => {
      void loadCampaign();
    }, [loadCampaign]),
  );

  const toggleActive = async (next: boolean) => {
    if (!campaign) return;
    try {
      const status: ReelStatus = next ? "Live" : "Paused";
      await api.patch(`/reels/${campaign.id}/`, { is_active: next, status });
      setCampaign({ ...campaign, is_active: next, status });
    } catch {}
  };

  if (!campaign) {
    return <CampaignSkeleton />;
  }

  const statusStyle = getStatusStyle(campaign.status);
  const reelThumbnailUrl =
    campaign.products
      .map((p) => String(p.image_url || "").trim())
      .find(Boolean) || "";

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 items-center justify-center">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-base font-semibold">Campaign Details</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700"
          onPress={() => router.push("/notifications" as any)}
        >
          <Ionicons name="notifications-outline" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 mt-2 mb-4">
          <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-3">Reel</Text>
          <View className="bg-neutral-900 rounded-2xl p-4 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-14 h-14 rounded-xl bg-neutral-700 overflow-hidden mr-4">
                {reelThumbnailUrl ? (
                  <Image source={{ uri: reelThumbnailUrl }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="flex-1 bg-neutral-600 items-center justify-center">
                    <Ionicons name="image-outline" size={22} color="#666" />
                  </View>
                )}
              </View>
              <View className="flex-1">
                <View className="flex-row items-center mb-1 flex-wrap gap-2">
                  <Text className="text-white text-base font-semibold" numberOfLines={1}>
                    {campaign.title}
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
                    <Text className={`text-xs font-medium ${statusStyle.text}`}>{campaign.status}</Text>
                  </View>
                </View>
                <Text className="text-neutral-400 text-xs" numberOfLines={1}>
                  {campaign.handle}
                </Text>
              </View>
            </View>
            <View className="ml-3">
              <Switch
                value={campaign.is_active}
                onValueChange={toggleActive}
                trackColor={{ false: "#444", true: statusStyle.trackColor }}
                thumbColor="#fff"
                style={{ transform: [{ scale: 0.8 }] }}
              />
            </View>
          </View>
        </View>

        <View className="flex-row px-5 gap-3 mb-6">
          <StatCard icon="trending-up" label="EARNINGS" value={`Rs ${campaign.earnings}`} />
          <StatCard icon="cart-outline" label="ORDERS" value={String(campaign.orders)} />
          <StatCard icon="megaphone-outline" label="SHARES" value={String(campaign.shares)} />
        </View>

        <View className="px-5">
          <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Detected products
          </Text>

          {campaign.products.map((product) => (
            <View key={product.id} className="bg-neutral-900 rounded-2xl p-4 mb-3">
              <View className="flex-row items-center">
              <View className="w-14 h-14 rounded-xl bg-neutral-700 overflow-hidden mr-4">
                {product.image_url ? (
                  <Image source={{ uri: product.image_url }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <View className="flex-1 bg-neutral-600 items-center justify-center">
                    <Ionicons name="cube-outline" size={22} color="#888" />
                  </View>
                )}
              </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-semibold mb-0.5" numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text className="text-neutral-500 text-xs mb-1" numberOfLines={1}>
                    {product.store}
                  </Text>
                  <Text className="text-white text-sm font-bold">Rs {product.price}</Text>
                  {product.product_link ? (
                    <View className="mt-2 flex-row items-center gap-2">
                      <TouchableOpacity
                        className="self-start px-3 py-1.5 rounded-full bg-amber-500/20"
                        onPress={() => void openAffiliateLink(product.product_link)}
                      >
                        <Text className="text-amber-400 text-xs font-semibold">Open Buy Link</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="self-start px-3 py-1.5 rounded-full bg-neutral-700/70"
                        onPress={async () => {
                          await Clipboard.setStringAsync(product.product_link);
                          showAlert("Copied", "Buy link copied to clipboard.");
                        }}
                      >
                        <Text className="text-neutral-100 text-xs font-semibold">Copy Link</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
