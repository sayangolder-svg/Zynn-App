import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    LayoutAnimation,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_SECTIONS: { title: string; items: FAQItem[] }[] = [
  {
    title: "Getting Started",
    items: [
      {
        question: "What is Zynn AI?",
        answer:
          "Zynn AI is a platform that lets creators earn commissions by sharing shoppable Instagram reels. When someone purchases a product through your reel, you earn a commission.",
      },
      {
        question: "How do I create a shoppable reel?",
        answer:
          'Tap the "+" button on the Home or Reels tab, paste your Instagram reel link, and our AI will automatically detect products. You can then add product links and activate the campaign.',
      },
      {
        question: "Do I need an Instagram account?",
        answer:
          "Yes, you need at least one Instagram account connected to Zynn AI. We verify your account ownership via a DM code during signup.",
      },
    ],
  },
  {
    title: "Earnings & Payments",
    items: [
      {
        question: "How do I earn money?",
        answer:
          "You earn a commission every time someone makes a purchase through a product link in your shoppable reel. Commission rates vary by product category and brand.",
      },
      {
        question: "When do I get paid?",
        answer:
          "Payouts are processed bi-weekly on the 1st and 15th of each month. Funds arrive within 3–5 business days. A minimum balance of ₹500 is required.",
      },
      {
        question: "Why are my earnings marked as pending?",
        answer:
          "Earnings stay pending until the return/refund window closes (typically 7–14 days). Once confirmed, they move to credited status and become eligible for payout.",
      },
      {
        question: "How do I add a bank account?",
        answer:
          'Go to Earnings tab and tap "Add Bank Account". You\'ll need your bank account number, IFSC code, PAN number, and account holder name.',
      },
    ],
  },
  {
    title: "Reels & Campaigns",
    items: [
      {
        question: "What happens when I pause a reel?",
        answer:
          "Pausing a reel stops it from generating new clicks and orders. Your existing earnings are unaffected. You can reactivate it anytime.",
      },
      {
        question: "Can I add multiple products to one reel?",
        answer:
          "Yes! Our AI detects products in your reel and you can add individual product links for each detected item.",
      },
      {
        question: "Why was my reel not approved?",
        answer:
          "Reels must comply with our content guidelines. Common reasons include copyrighted content, misleading claims, or products from unsupported categories.",
      },
    ],
  },
  {
    title: "Account & Settings",
    items: [
      {
        question: "How do I change my phone number?",
        answer:
          "Go to Settings → Change Phone Number. Enter your new number, verify it with an OTP, and your account will be updated.",
      },
      {
        question: "Can I connect multiple Instagram accounts?",
        answer:
          "Yes, go to Settings → Instagram Accounts to add more accounts. Each account needs to be verified via DM.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Go to Settings → Delete Account. This action is permanent and all your data, earnings history, and campaigns will be deleted.",
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      activeOpacity={0.7}
      className="bg-neutral-900 rounded-2xl px-4 py-4 mb-3"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-white text-sm font-semibold flex-1 mr-3">
          {item.question}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#777"
        />
      </View>
      {expanded && (
        <Text className="text-neutral-400 text-sm leading-5 mt-3">
          {item.answer}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Help & FAQ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <Text className="text-neutral-400 text-sm mt-4 mb-6 leading-5">
          Find answers to commonly asked questions below. If you can't find what
          you're looking for, reach out via the Contact Form in Settings.
        </Text>

        {FAQ_SECTIONS.map((section, sIndex) => (
          <View key={sIndex} className="mb-6">
            <Text className="text-neutral-500 text-xs uppercase tracking-wider mb-3">
              {section.title}
            </Text>
            {section.items.map((item, iIndex) => (
              <FAQAccordion key={iIndex} item={item} />
            ))}
          </View>
        ))}

        {/* Contact CTA */}
        <TouchableOpacity
          className="bg-neutral-900 rounded-2xl p-5 items-center mt-2"
          activeOpacity={0.7}
          onPress={() => router.push("/contact-form" as any)}
        >
          <Ionicons name="chatbox-ellipses-outline" size={28} color="#f59e0b" />
          <Text className="text-white text-base font-semibold mt-2">
            Still need help?
          </Text>
          <Text className="text-neutral-400 text-sm mt-1">
            Contact our support team
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
