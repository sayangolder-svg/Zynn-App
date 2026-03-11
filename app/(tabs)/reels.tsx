import SlideToActivate from "@/components/slide-to-activate";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ── types ── */
interface ReelPreview {
  title: string;
  handle: string;
  thumbnail: any;
}

interface DetectedProduct {
  id: string;
  name: string;
  store: string;
  price: string;
  image: any;
}

/* ── mock data ── */
const MOCK_REEL: ReelPreview = {
  title: "GRWM: Dewy Base",
  handle: "@zzynn.ai | payra.maina",
  thumbnail: null,
};

const MOCK_PRODUCTS: DetectedProduct[] = [
  {
    id: "1",
    name: "Maybelline Fit Me Dewy+S...",
    store: "Nykaa | payra.maina",
    price: "₹ 589",
    image: null,
  },
];

/* ── sub-components ── */

function ProductRow({
  product,
  onRemove,
}: {
  product: DetectedProduct;
  onRemove: () => void;
}) {
  return (
    <View className="bg-neutral-900 rounded-2xl p-4 flex-row items-center mb-3">
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

      {/* Delete */}
      <TouchableOpacity
        onPress={onRemove}
        className="w-9 h-9 rounded-full bg-red-900/40 items-center justify-center ml-2"
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={16} color="#f87171" />
      </TouchableOpacity>
    </View>
  );
}

/* ── link validation states ── */
type LinkState = "idle" | "validating" | "valid" | "invalid";

/** Simple check — a valid product link starts with http(s) and contains a known store domain */
function isPlausibleProductLink(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  const knownDomains = [
    "amazon",
    "flipkart",
    "myntra",
    "nykaa",
    "ajio",
    "meesho",
    "shopsy",
    "amzn",
    "bit.ly",
    "linktr.ee",
  ];
  return knownDomains.some((d) => trimmed.includes(d));
}

function AddProductLinkSection({
  onProductAdded,
}: {
  onProductAdded: (product: DetectedProduct) => void;
}) {
  const [link, setLink] = useState("");
  const [linkState, setLinkState] = useState<LinkState>("idle");
  const validationTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const handleLinkChange = (text: string) => {
    setLink(text);

    if (validationTimer.current) {
      clearTimeout(validationTimer.current);
      validationTimer.current = null;
    }

    const trimmed = text.trim();
    if (!trimmed) {
      setLinkState("idle");
      return;
    }

    setLinkState("validating");
    validationTimer.current = setTimeout(() => {
      if (isPlausibleProductLink(trimmed)) {
        setLinkState("valid");
      } else {
        setLinkState("invalid");
      }
    }, 600);
  };

  const handleDone = () => {
    if (linkState !== "valid" || !link.trim()) return;
    Keyboard.dismiss();

    onProductAdded({
      id: Date.now().toString(),
      name: "Added Product",
      store: "Store | user",
      price: "₹ 499",
      image: null,
    });
    setLink("");
    setLinkState("idle");
  };

  const handlePasteLink = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        handleLinkChange(text);
      }
    } catch {
      /* clipboard not available */
    }
  };

  const borderColor =
    linkState === "valid"
      ? "#4ade80"
      : linkState === "invalid"
        ? "#f87171"
        : "#333";

  return (
    <View className="mt-4">
      <Text className="text-neutral-500 text-xs text-right mb-2">
        Add links if our match is wrong.
      </Text>
      <View
        style={{ borderColor, borderWidth: 1, borderRadius: 16 }}
        className="bg-neutral-900 rounded-2xl px-4 py-3 flex-row items-center"
      >
        <TextInput
          className="flex-1 text-white text-sm"
          placeholder="Paste product link..."
          placeholderTextColor="#555"
          value={link}
          onChangeText={handleLinkChange}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
        {linkState === "validating" ? (
          <ActivityIndicator size="small" color="#999" />
        ) : linkState === "valid" ? (
          <View className="w-7 h-7 rounded-full bg-green-600 items-center justify-center">
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
        ) : linkState === "invalid" ? (
          <TouchableOpacity
            onPress={() => {
              setLink("");
              setLinkState("idle");
            }}
            activeOpacity={0.7}
            className="w-7 h-7 rounded-full bg-red-600/40 items-center justify-center"
          >
            <Ionicons name="close" size={16} color="#f87171" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handlePasteLink} activeOpacity={0.7}>
            <Ionicons name="clipboard-outline" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {linkState === "invalid" && (
        <Text className="text-red-400 text-xs mt-1.5 ml-1">
          Please paste a valid product link.
        </Text>
      )}

      <View className="items-end mt-3">
        {linkState === "valid" ? (
          <LinearGradient
            colors={["#FB812F", "#FD963A", "#F4B85E", "#CEBE8D", "#BBBE9F"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ borderRadius: 12, padding: 1.5 }}
          >
            <TouchableOpacity
              onPress={handleDone}
              className="bg-neutral-950 rounded-xl px-6 py-2.5"
              activeOpacity={0.8}
            >
              <Text className="text-white text-sm font-bold">DONE</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            disabled
            className="bg-neutral-800 rounded-xl px-6 py-2.5 opacity-50"
          >
            <Text className="text-neutral-400 text-sm font-bold">DONE</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/* ── main screen ── */

export default function AddReelScreen() {
  const router = useRouter();
  const [reelLink, setReelLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reelPreview, setReelPreview] = useState<ReelPreview | null>(null);
  const [products, setProducts] = useState<DetectedProduct[]>([]);

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setReelLink(text);
        fetchReelData(text);
      }
    } catch {
      /* clipboard not available */
    }
  };

  const handleLinkSubmit = () => {
    if (reelLink.trim()) {
      fetchReelData(reelLink.trim());
    }
  };

  const fetchReelData = (url: string) => {
    Keyboard.dismiss();
    setIsLoading(true);

    // Simulate API fetch
    setTimeout(() => {
      setReelPreview(MOCK_REEL);
      setProducts([...MOCK_PRODUCTS]);
      setIsLoading(false);
    }, 1500);
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addProduct = (product: DetectedProduct) => {
    setProducts((prev) => [...prev, product]);
  };

  const handleActivate = () => {
    Alert.alert("Campaign Activated!", "Your reel campaign is now live.");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-black pt-5"
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-5 mb-6">
            <Text className="text-white text-2xl font-bold">Add Reel</Text>
          </View>

          {/* ── Reel link section ── */}
          <View className="px-5 mt-2 mb-4">
            <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Reel link
            </Text>

            {!reelPreview ? (
              <>
                <View className="bg-neutral-900 rounded-2xl px-4 py-3 flex-row items-center border border-neutral-800">
                  <TextInput
                    className="flex-1 text-white text-sm mr-2"
                    placeholder="Paste Instagram reel link..."
                    placeholderTextColor="#555"
                    value={reelLink}
                    onChangeText={setReelLink}
                    onSubmitEditing={handleLinkSubmit}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    returnKeyType="go"
                  />
                  <TouchableOpacity
                    onPress={handlePaste}
                    className="bg-white rounded-lg px-4 py-2 flex-row items-center"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="clipboard-outline" size={14} color="#000" />
                    <Text className="text-black text-xs font-bold ml-1.5">
                      Paste
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-neutral-600 text-xs mt-2 ml-1">
                  Example: https://instagram.com/reel/...
                </Text>

                {isLoading && (
                  <View className="items-center mt-8">
                    <ActivityIndicator size="large" color="#FB812F" />
                    <Text className="text-neutral-500 text-sm mt-3">
                      Fetching reel details...
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <View className="bg-neutral-900 rounded-2xl px-4 py-3 flex-row items-center border border-neutral-800 mb-4">
                  <Text
                    className="flex-1 text-neutral-400 text-sm"
                    numberOfLines={1}
                  >
                    {reelLink || "https://instagram.com/reel/..."}
                  </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Ionicons name="open-outline" size={18} color="#666" />
                  </TouchableOpacity>
                </View>

                <View className="bg-neutral-900 rounded-2xl p-4 flex-row items-center">
                  <View className="w-14 h-14 rounded-xl bg-neutral-700 overflow-hidden mr-4">
                    {reelPreview.thumbnail ? (
                      <Image
                        source={reelPreview.thumbnail}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="flex-1 bg-neutral-600 items-center justify-center">
                        <Ionicons name="image-outline" size={22} color="#666" />
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-white text-base font-semibold mb-0.5"
                      numberOfLines={1}
                    >
                      {reelPreview.title}
                    </Text>
                    <Text
                      className="text-neutral-400 text-xs"
                      numberOfLines={1}
                    >
                      {reelPreview.handle}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* ── Detected Products ── */}
          {reelPreview && products.length > 0 && (
            <View className="px-5 mt-2">
              <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-3">
                Detected products
              </Text>

              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onRemove={() => removeProduct(product.id)}
                />
              ))}
            </View>
          )}

          {/* ── Add product link ── */}
          {reelPreview && (
            <View className="px-5">
              <AddProductLinkSection onProductAdded={addProduct} />
            </View>
          )}
        </ScrollView>

        {/* ── Slide to activate (pinned at bottom) ── */}
        {reelPreview && (
          <View className="px-5 pb-6">
            <SlideToActivate onActivate={handleActivate} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
