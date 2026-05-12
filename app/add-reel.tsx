import { useAlert } from "@/components/app-alert";
import SlideToActivate from "@/components/slide-to-activate";
import { Ionicons } from "@expo/vector-icons";
import { buildAffiliateLink, openAffiliateLink } from "@/lib/affiliate";
import { api } from "@/lib/api";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
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
  product_link?: string;
  image: any;
}

/* ── api response ── */
interface ReelProcessApiResponse {
  id: number;
  title: string;
  handle: string;
  cart_id?: string;
  prices_pending?: boolean;
  warning?: string;
  ingestion_status?: string;
  products: Array<{
    name: string;
    store: string;
    price: string | number;
    product_link: string;
    image_url?: string;
  }>;
}

/* ── sub-components ── */

function ProductRow({
  product,
  onRemove,
  pricesPending,
  isCampaignActivated,
}: {
  product: DetectedProduct;
  onRemove: () => void;
  pricesPending?: boolean;
  isCampaignActivated?: boolean;
}) {
  const { showAlert } = useAlert();
  const numericPrice = Number(product.price.replace(/[^\d.]/g, ""));
  const isPendingPrice = pricesPending && (!Number.isFinite(numericPrice) || numericPrice <= 0);

  const handleCopyLink = async () => {
    if (!product.product_link) return;
    const linkToCopy = isCampaignActivated
      ? buildAffiliateLink(product.product_link)
      : product.product_link;
    await Clipboard.setStringAsync(linkToCopy);
    showAlert("Copied", isCampaignActivated ? "Affiliate buy link copied." : "Buy link copied to clipboard.");
  };

  const handleOpenLink = async () => {
    if (!product.product_link) return;
    if (isCampaignActivated) {
      await openAffiliateLink(product.product_link || "");
      return;
    }
    await Linking.openURL(product.product_link || "");
  };

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
        {isPendingPrice ? (
          <View className="mt-1 flex-row items-center">
            <ActivityIndicator size="small" color="#FB812F" />
            <Text className="text-amber-300 text-xs ml-2">Updating best price...</Text>
          </View>
        ) : (
          <Text className="text-white text-sm font-bold">{product.price}</Text>
        )}
        {product.product_link ? (
          <View className="mt-2 flex-row items-center gap-2">
            <TouchableOpacity
              className="self-start px-3 py-1.5 rounded-full bg-amber-500/20"
              onPress={() => void handleOpenLink()}
            >
              <Text className="text-amber-400 text-xs font-semibold">Open Buy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="self-start px-3 py-1.5 rounded-full bg-neutral-700/70"
              onPress={handleCopyLink}
            >
              <Text className="text-neutral-100 text-xs font-semibold">Copy Link</Text>
            </TouchableOpacity>
          </View>
        ) : null}
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
  // Accept common e-commerce / affiliate domains (expand as needed)
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

  /** Auto-validate whenever the link text changes */
  const handleLinkChange = (text: string) => {
    setLink(text);

    // Clear any pending validation
    if (validationTimer.current) {
      clearTimeout(validationTimer.current);
      validationTimer.current = null;
    }

    const trimmed = text.trim();
    if (!trimmed) {
      setLinkState("idle");
      return;
    }

    // Wait a short debounce then validate
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

      {/* Invalid link hint */}
      {linkState === "invalid" && (
        <Text className="text-red-400 text-xs mt-1.5 ml-1">
          Please paste a valid product link.
        </Text>
      )}

      {/* Done button — gradient border when valid, plain otherwise */}
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
  const { showAlert } = useAlert();
  const [reelLink, setReelLink] = useState("");
  const [inlineError, setInlineError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [reelPreview, setReelPreview] = useState<ReelPreview | null>(null);
  const [products, setProducts] = useState<DetectedProduct[]>([]);
  const [reelId, setReelId] = useState<number | null>(null);
  const [ingestionStatus, setIngestionStatus] = useState<string>("");
  const [ingestionWarning, setIngestionWarning] = useState<string>("");
  const [cartId, setCartId] = useState<string | null>(null);
  const [pricesPending, setPricesPending] = useState(false);
  const [isCampaignActivated, setIsCampaignActivated] = useState(false);
  const pollIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const extractSharedUrl = (text: string) => {
    const match = text.match(/https?:\/\/[^\s]+/i);
    return (match?.[0] || text).trim().replace(/[),\].}"']+$/, "");
  };

  const pollCartForUpdates = async (cid: string) => {
    try {
      console.log(`🔄 [add-reel] Polling cart: ${cid}`);
      
      const data = await api.get<{
        cart_id: string;
        products: Array<{
          id: string;
          name: string;
          store: string;
          price: number;
          product_link: string;
          image_url?: string;
        }>;
        price_count: number;
        prices_pending: boolean;
      }>(`/cart/${cid}/products`);

      console.log(`   ✅ Poll Response: ${data.products?.length} products, ${data.price_count} with prices`);
      
      // Update products with latest prices and images
      setProducts(
        (data.products || []).map((p) => ({
          id: p.id || "unknown",
          name: p.name || "Detected Product",
          store: p.store || "Direct",
          price: `Rs ${p.price ?? 0}`,
          product_link: p.product_link || "",
          image: p.image_url ? { uri: p.image_url } : null,
        })),
      );

      // If prices are no longer pending, stop polling
      if (!data.prices_pending) {
        console.log(`   ✅ All prices loaded - stopping poll`);
        setPricesPending(false);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    } catch (error) {
      console.warn("❌ Error polling cart updates:", error);
      // Continue polling even if this request fails
    }
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        const clean = extractSharedUrl(text);
        setReelLink(clean);
        fetchReelData(clean);
      }
    } catch {
      /* clipboard not available */
    }
  };

  const handleLinkSubmit = () => {
    if (reelLink.trim()) {
      const clean = extractSharedUrl(reelLink.trim());
      setReelLink(clean);
      fetchReelData(clean);
    }
  };

  const fetchReelData = async (url: string) => {
    Keyboard.dismiss();
    setIsLoading(true);
    try {
      const data = await api.post<ReelProcessApiResponse>("/app/reels/process/", {
        reel_link: url,
      });
      setIsCampaignActivated(false);
      setInlineError("");
      const safeTitle =
        (data.title || "").trim() && (data.title || "").trim().toLowerCase() !== "untitled reel"
          ? (data.title || "").trim()
          : "Instagram Reel";
      setReelPreview({
        title: safeTitle,
        handle: data.handle || "@zynn.creator",
        thumbnail: null,
      });
      setReelId(data.id ?? null);
      setCartId(data.cart_id ?? null);
      setIngestionStatus(data.ingestion_status || "");
      setIngestionWarning(data.warning || "");
      
      const hasPricesPending = data.prices_pending ?? false;
      const responseCartId = data.cart_id;
      
      console.log("🔌 [add-reel] Reel Response Received:");
      console.log(`   cart_id: ${responseCartId}`);
      console.log(`   prices_pending: ${hasPricesPending}`);
      console.log(`   product_count: ${data.products?.length}`);
      
      setPricesPending(hasPricesPending);
      
      setProducts(
        (data.products || []).map((p, idx) => ({
          id: String(idx + 1),
          name: p.name || "Detected Product",
          store: p.store || "Direct",
          price: `Rs ${p.price ?? 0}`,
          product_link: p.product_link || "",
          image: p.image_url ? { uri: p.image_url } : null,
        })),
      );
      
      // If prices are pending and we have a cart_id, start polling for updates
      if (hasPricesPending && responseCartId) {
        console.log(`🔄 [add-reel] Starting polling for cart: ${responseCartId}`);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
        pollCartForUpdates(responseCartId);
        // Poll every 3 seconds for updated prices/images
        pollIntervalRef.current = setInterval(() => {
          pollCartForUpdates(responseCartId);
        }, 3000);
      } else {
        console.log(`⚠️ [add-reel] Polling skipped - hasPricesPending=${hasPricesPending}, cartId=${responseCartId}`);
      }
      
      if (data.warning) {
        showAlert("Heads up", data.warning);
      }
    } catch (error) {
      const maybeError = error as { message?: string; status?: number } | null;
      const ownershipMessage =
        "Sorry, this reel doesn't seem to be yours. Please check before sharing again.";
      const message =
        maybeError?.status === 400
          ? ownershipMessage
          :
        (typeof maybeError?.message === "string" && maybeError.message) ||
        "Failed to fetch reel details";
      setInlineError(message);
      showAlert("Error", message);
      setReelPreview(null);
      setProducts([]);
      setReelId(null);
      setCartId(null);
      setIngestionStatus("");
      setIngestionWarning("");
      setPricesPending(false);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addProduct = (product: DetectedProduct) => {
    setProducts((prev) => [...prev, product]);
  };

  const handleActivate = async () => {
    if (!reelPreview || reelId == null) return;
    try {
      setActivating(true);
      // Clear polling interval before leaving
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      await api.post(`/reels/${reelId}/activate/`);
      setIsCampaignActivated(true);
      showAlert("Campaign Activated!", "Your reel campaign is now live.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      showAlert(
        "Error",
        error instanceof Error ? error.message : "Failed to activate campaign",
      );
    } finally {
      setActivating(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);


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

        <Text className="text-white text-base font-semibold">Add Reel</Text>

        <View style={{ width: 36 }} />
      </View>

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
          {/* ── Reel link section ── */}
          <View className="px-5 mt-2 mb-4">
            <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-3">
              Reel link
            </Text>

            {!reelPreview ? (
              <>
                {/* Input with paste button */}
                <View className="bg-neutral-900 rounded-2xl px-4 py-3 flex-row items-center border border-neutral-800">
                  <TextInput
                    className="flex-1 text-white text-sm mr-2"
                    placeholder="Paste Instagram reel link..."
                    placeholderTextColor="#555"
                    value={reelLink}
                    onChangeText={(text) => {
                      setReelLink(text);
                      if (inlineError) setInlineError("");
                    }}
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

                {/* Example text */}
                <Text className="text-neutral-600 text-xs mt-2 ml-1">
                  Example: https://instagram.com/reel/...
                </Text>

                {inlineError ? (
                  <View className="mt-3 rounded-xl border border-red-500/40 bg-red-900/20 px-3 py-2">
                    <Text className="text-red-300 text-xs font-medium">{inlineError}</Text>
                  </View>
                ) : null}

                {/* Loading indicator */}
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
                {/* Show pasted link */}
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

                {/* Reel preview card */}
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

                {(ingestionWarning || ingestionStatus === "no_products") && (
                  <View className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                    <Text className="text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
                      Detection note
                    </Text>
                    <Text className="text-amber-50 text-sm leading-5">
                      {ingestionWarning ||
                        "No products were detected by the analysis pipeline. Add product links manually if needed."}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* ── Detected Products ── */}
          {reelPreview && products.length > 0 && (
            <View className="px-5 mt-2">
              <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-3">
                Detected products
              </Text>
              {pricesPending && (
                <View className="mb-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 flex-row items-center">
                  <ActivityIndicator size="small" color="#FB812F" />
                  <Text className="text-amber-100 text-xs ml-2">
                    Fetching updated prices...
                  </Text>
                </View>
              )}

              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onRemove={() => removeProduct(product.id)}
                  pricesPending={pricesPending}
                  isCampaignActivated={isCampaignActivated}
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
            <SlideToActivate onActivate={activating ? () => {} : handleActivate} />
          </View>
        )}
      </KeyboardAvoidingView>
      {activating ? (
        <View className="absolute inset-0 bg-black/70 items-center justify-center">
          <ActivityIndicator size="large" color="#FB812F" />
          <Text className="text-neutral-200 text-sm mt-3">
            Activating campaign...
          </Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
