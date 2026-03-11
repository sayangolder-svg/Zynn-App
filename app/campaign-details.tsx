import StatCard from "@/components/stat-card";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Image,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ── types ── */
type ReelStatus = "Live" | "Draft" | "Paused";

interface ReelData {
  title: string;
  handle: string;
  status: ReelStatus;
  isActive: boolean;
  image: any;
}

interface StatData {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  store: string;
  price: string;
  image: any;
  affiliatedBrands: string[];
}

interface CampaignData {
  reel: ReelData;
  stats: StatData[];
  products: Product[];
}

/* ── per-reel mock data ── */
const CAMPAIGNS: Record<string, CampaignData> = {
  "1": {
    reel: {
      title: "GRWM: Dewy Base",
      handle: "@zzynn.ai | payra.maina",
      status: "Live",
      isActive: true,
      image: null,
    },
    stats: [
      { icon: "trending-up", label: "EARNINGS", value: "₹12,450" },
      { icon: "cart-outline", label: "ORDERS", value: "34" },
      { icon: "megaphone-outline", label: "SHARES", value: "1,280" },
    ],
    products: [
      {
        id: "1",
        name: "Maybelline Fit Me Dewy+S...",
        store: "Nykaa | payra.maina",
        price: "₹ 589",
        image: null,
        affiliatedBrands: ["Nykaa", "Amazon", "Flipkart"],
      },
      {
        id: "2",
        name: "Swiss Beauty Liquid Conce...",
        store: "Nykaa | payra.maina",
        price: "₹ 229",
        image: null,
        affiliatedBrands: ["Nykaa", "Meesho"],
      },
      {
        id: "3",
        name: "Benefit Benetint Lip & Chee...",
        store: "Nykaa | payra.maina",
        price: "₹ 229",
        image: null,
        affiliatedBrands: ["Nykaa", "Amazon", "Myntra"],
      },
    ],
  },
  "2": {
    reel: {
      title: "Lip combo that la...",
      handle: "@zzynn.ai | payra.maina",
      status: "Draft",
      isActive: false,
      image: null,
    },
    stats: [
      { icon: "trending-up", label: "EARNINGS", value: "₹3,200" },
      { icon: "cart-outline", label: "ORDERS", value: "11" },
      { icon: "megaphone-outline", label: "CLICKS", value: "420" },
    ],
    products: [
      {
        id: "1",
        name: "MAC Matte Lipstick Mehr...",
        store: "Nykaa | payra.maina",
        price: "₹ 1,750",
        image: null,
        affiliatedBrands: ["Nykaa", "Amazon"],
      },
      {
        id: "2",
        name: "Lakme 9 to 5 Lip Liner...",
        store: "Nykaa | payra.maina",
        price: "₹ 199",
        image: null,
        affiliatedBrands: ["Nykaa", "Flipkart", "Myntra"],
      },
    ],
  },
  "3": {
    reel: {
      title: "Best drugsto...",
      handle: "@zzynn.ai | payra.maina",
      status: "Paused",
      isActive: false,
      image: null,
    },
    stats: [
      { icon: "trending-up", label: "EARNINGS", value: "₹1,890" },
      { icon: "cart-outline", label: "ORDERS", value: "7" },
      { icon: "megaphone-outline", label: "CLICKS", value: "310" },
    ],
    products: [
      {
        id: "1",
        name: "Neutrogena Ultra Sheer...",
        store: "Nykaa | payra.maina",
        price: "₹ 449",
        image: null,
        affiliatedBrands: ["Nykaa", "Amazon", "Flipkart"],
      },
      {
        id: "2",
        name: "La Shield SPF 50 Sunscr...",
        store: "Nykaa | payra.maina",
        price: "₹ 339",
        image: null,
        affiliatedBrands: ["Nykaa", "Amazon"],
      },
      {
        id: "3",
        name: "Minimalist SPF 50 PA+++...",
        store: "Nykaa | payra.maina",
        price: "₹ 399",
        image: null,
        affiliatedBrands: ["Nykaa", "Ajio", "Meesho"],
      },
    ],
  },
};

/* fallback */
const DEFAULT_CAMPAIGN = CAMPAIGNS["1"];

function ProductRow({ product }: { product: Product }) {
  return (
    <View className="bg-neutral-900 rounded-2xl p-4 mb-3">
      <View className="flex-row items-center">
        {/* Thumbnail */}
        <View className="w-14 h-14 rounded-xl bg-neutral-700 overflow-hidden mr-4">
          {product.image ? (
            <Image
              source={product.image}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 bg-neutral-600 items-center justify-center">
              <Ionicons name="cube-outline" size={22} color="#888" />
            </View>
          )}
        </View>

        {/* Info */}
        <View className="flex-1">
          <Text
            className="text-white text-sm font-semibold mb-0.5"
            numberOfLines={1}
          >
            {product.name}
          </Text>
          <Text className="text-neutral-500 text-xs mb-1" numberOfLines={1}>
            {product.store}
          </Text>
          <Text className="text-white text-sm font-bold">{product.price}</Text>
        </View>

        {/* Delete button */}
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-red-900/40 items-center justify-center ml-2"
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color="#f87171" />
        </TouchableOpacity>
      </View>

      {/* Affiliated Brands */}
      {product.affiliatedBrands.length > 0 && (
        <View className="mt-3 pt-3 border-t border-neutral-800">
          <Text className="text-neutral-500 text-xs font-semibold uppercase mb-2">
            Affiliated Brands
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {product.affiliatedBrands.map((brand) => (
              <View
                key={brand}
                className="bg-neutral-800 rounded-full px-3 py-1"
              >
                <Text className="text-neutral-300 text-xs font-medium">
                  {brand}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

/* ── status styling ── */
function getStatusStyle(status: ReelStatus) {
  switch (status) {
    case "Live":
      return {
        bg: "bg-green-900/60",
        text: "text-green-400",
        dotColor: "#4ade80",
        trackColor: "#4ade80",
      };
    case "Draft":
      return {
        bg: "bg-amber-900/60",
        text: "text-amber-400",
        dotColor: "#fbbf24",
        trackColor: "#fbbf24",
      };
    case "Paused":
      return {
        bg: "bg-yellow-900/60",
        text: "text-yellow-400",
        dotColor: "#facc15",
        trackColor: "#facc15",
      };
  }
}

/* ── main screen ── */

export default function CampaignDetailsScreen() {
  const router = useRouter();
  const { reelId } = useLocalSearchParams<{ reelId: string }>();

  const campaign = CAMPAIGNS[reelId ?? "1"] ?? DEFAULT_CAMPAIGN;
  const { reel, stats, products } = campaign;
  const statusStyle = getStatusStyle(reel.status);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* ── Header ── */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-9 h-9 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-base font-semibold">
          Campaign Details
        </Text>

        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700"
          onPress={() => router.push("/notifications" as any)}
        >
          <Ionicons name="notifications-outline" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Reel section ── */}
        <View className="px-5 mt-2 mb-4">
          <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Reel
          </Text>

          <View className="bg-neutral-900 rounded-2xl p-4 flex-row items-center">
            {/* Reel thumbnail */}
            <View className="w-14 h-14 rounded-xl bg-neutral-700 overflow-hidden mr-4">
              {reel.image ? (
                <Image
                  source={reel.image}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 bg-neutral-600 items-center justify-center">
                  <Ionicons name="image-outline" size={22} color="#666" />
                </View>
              )}
            </View>

            {/* Reel info */}
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
              <Text className="text-neutral-400 text-xs" numberOfLines={1}>
                {reel.handle}
              </Text>
            </View>

            {/* Toggle */}
            <Switch
              value={reel.isActive}
              trackColor={{ false: "#444", true: statusStyle.trackColor }}
              thumbColor="#fff"
              style={{ transform: [{ scale: 0.8 }] }}
            />
          </View>
        </View>

        {/* ── Stats Row ── */}
        <View className="flex-row px-5 gap-3 mb-6">
          {stats.map((s) => (
            <StatCard
              key={s.label}
              icon={s.icon}
              label={s.label}
              value={s.value}
            />
          ))}
        </View>

        {/* ── Detected Products ── */}
        <View className="px-5">
          <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Detected products
          </Text>

          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
