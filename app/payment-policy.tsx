import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SECTIONS = [
  {
    title: "1. Commission Structure",
    body: "Creators earn a commission on every qualifying sale made through their shoppable reels. Commission rates vary by product category and brand agreement. Rates are displayed on each campaign before you opt in.",
  },
  {
    title: "2. Payout Schedule",
    body: "Earnings are processed on a bi-weekly basis. Payouts are initiated every 1st and 15th of the month for the previous period's confirmed earnings. Funds typically arrive within 3–5 business days depending on your bank.",
  },
  {
    title: "3. Minimum Payout Threshold",
    body: "A minimum balance of ₹500 is required to initiate a payout. If your balance is below this threshold, it will roll over to the next payout cycle.",
  },
  {
    title: "4. Pending & Credited Earnings",
    body: "Earnings remain in 'Pending' status until the return/refund window for the associated order has closed (typically 7–14 days). Once confirmed, earnings move to 'Credited' status and become eligible for payout.",
  },
  {
    title: "5. Refunds & Chargebacks",
    body: "If a customer returns a product or initiates a chargeback, the associated commission will be deducted from your pending earnings. If the pending balance is insufficient, the amount may be adjusted from future payouts.",
  },
  {
    title: "6. Tax Responsibilities",
    body: "Creators are responsible for reporting and paying any applicable taxes on their earnings. Zynn AI may deduct TDS (Tax Deducted at Source) as required by applicable Indian tax laws. PAN details are required for payouts.",
  },
  {
    title: "7. Bank Account Verification",
    body: "To receive payouts, you must add and verify at least one bank account. Ensure your account details (account number, IFSC, PAN, and name) are accurate. Zynn AI is not liable for failed transfers due to incorrect details.",
  },
  {
    title: "8. Changes to Policy",
    body: "Zynn AI reserves the right to modify commission rates, payout schedules, or any terms in this policy at any time. Creators will be notified of material changes via the app or email.",
  },
];

export default function PaymentPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Payment Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-neutral-500 text-xs mt-4 mb-6">
          Last updated: March 1, 2026
        </Text>

        {SECTIONS.map((section, index) => (
          <View key={index} className="mb-5">
            <Text className="text-white text-base font-bold mb-2">
              {section.title}
            </Text>
            <Text className="text-neutral-400 text-sm leading-5">
              {section.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
