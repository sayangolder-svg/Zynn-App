import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using the Zynn AI application, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the service. We reserve the right to update these terms at any time, and continued use constitutes acceptance.",
  },
  {
    title: "2. Eligibility",
    body: "You must be at least 18 years old and a resident of India to use Zynn AI. By registering, you confirm that you meet these requirements and that the information you provide is accurate and complete.",
  },
  {
    title: "3. Account Registration",
    body: "You are required to register an account with a valid phone number and connect at least one Instagram account. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.",
  },
  {
    title: "4. Creator Obligations",
    body: "As a creator, you agree to: (a) only post original content or content you have rights to share, (b) not engage in fraudulent clicks, fake orders, or any form of manipulation, (c) comply with Instagram's terms of service and community guidelines, and (d) accurately represent products featured in your reels.",
  },
  {
    title: "5. Commission & Earnings",
    body: "Commission rates are set by Zynn AI in partnership with brands and may vary by product category. Zynn AI reserves the right to adjust commission rates at any time. Earnings are subject to verification and may be reversed in case of returns, chargebacks, or fraudulent activity.",
  },
  {
    title: "6. Intellectual Property",
    body: "You retain ownership of your content. By uploading reels to Zynn AI, you grant us a non-exclusive, worldwide license to display, distribute, and promote your content within the platform. Zynn AI's branding, logos, and technology are our exclusive property.",
  },
  {
    title: "7. Prohibited Activities",
    body: "You may not: (a) use bots, scripts, or automation tools with the service, (b) create fake accounts or impersonate others, (c) attempt to reverse-engineer or interfere with the platform, (d) share misleading or false product information, or (e) engage in any activity that violates applicable laws.",
  },
  {
    title: "8. Account Suspension & Termination",
    body: "Zynn AI may suspend or terminate your account at any time for violation of these terms, fraudulent activity, or any behavior that harms the platform or its users. Pending earnings may be forfeited upon termination for cause.",
  },
  {
    title: "9. Limitation of Liability",
    body: "Zynn AI is provided 'as is' without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount of commissions earned by you in the preceding 3 months.",
  },
  {
    title: "10. Dispute Resolution",
    body: "Any disputes arising from these terms shall be resolved through binding arbitration in accordance with Indian law. The arbitration shall take place in Bangalore, India. You agree to waive any right to participate in class-action lawsuits.",
  },
  {
    title: "11. Governing Law",
    body: "These Terms of Service are governed by and construed in accordance with the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.",
  },
  {
    title: "12. Contact",
    body: "For questions about these Terms of Service, please contact us through the Contact Form in the Settings page or email us at legal@zynn.ai.",
  },
];

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Terms of Service</Text>
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
