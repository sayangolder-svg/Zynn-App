import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We collect personal information you provide directly, such as your name, email address, phone number, Instagram username, PAN details, and bank account information. We also collect usage data including app interactions, device information, and analytics.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to provide and improve our services, process payments and commissions, verify your identity, communicate updates and promotional content, and comply with legal obligations.",
  },
  {
    title: "3. Information Sharing",
    body: "We do not sell your personal data. We may share information with payment processors for payouts, analytics providers to improve our service, and legal authorities when required by law. Brand partners only receive anonymized, aggregated performance data.",
  },
  {
    title: "4. Data Security",
    body: "We use industry-standard encryption and security measures to protect your data. Bank details and PAN information are encrypted at rest and in transit. However, no system is 100% secure and we cannot guarantee absolute security.",
  },
  {
    title: "5. Data Retention",
    body: "We retain your data for as long as your account is active or as needed to provide services. Financial records are retained as required by tax and regulatory laws. You may request deletion of your account and associated data at any time.",
  },
  {
    title: "6. Your Rights",
    body: "You have the right to access, correct, or delete your personal data. You can update your profile and bank details directly in the app. To request a full data export or account deletion, contact us through the Contact Form in Settings.",
  },
  {
    title: "7. Cookies & Tracking",
    body: "We use minimal tracking for analytics and performance improvement. We do not use third-party advertising trackers. You can opt out of analytics collection in your device settings.",
  },
  {
    title: "8. Children's Privacy",
    body: "Our service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. If we learn we have collected data from a minor, we will delete it promptly.",
  },
  {
    title: "9. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of significant changes via the app or email. Continued use of the app after changes constitutes acceptance of the updated policy.",
  },
  {
    title: "10. Contact Us",
    body: "If you have questions about this Privacy Policy or your data, please reach out via the Contact Form in the Settings page or email us at privacy@zynn.ai.",
  },
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Privacy Policy</Text>
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
