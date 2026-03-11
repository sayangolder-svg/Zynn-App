import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GRADIENT_COLORS = [
  "#FB812F",
  "#FD963A",
  "#F4B85E",
  "#CEBE8D",
  "#BBBE9F",
  "#A1B4C1",
  "#868AC4",
] as const;
const GRADIENT_LOCATIONS = [0, 0.16, 0.31, 0.44, 0.53, 0.69, 1] as const;

interface IGAccount {
  id: string;
  name: string;
  email: string;
  initials: string;
}

const MOCK_ACCOUNTS: IGAccount[] = [
  {
    id: "1",
    name: "HELLO XYZ",
    email: "xyz@gmail.com",
    initials: "XY",
  },
];

export default function InstagramAccountsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Instagram Accounts</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 justify-between">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Cards */}
          {MOCK_ACCOUNTS.map((account) => (
            <View
              key={account.id}
              className="bg-neutral-900 rounded-2xl flex-row items-center px-4 py-4 mb-3"
            >
              <View className="w-12 h-12 rounded-full bg-neutral-600 items-center justify-center mr-3">
                <Text className="text-white text-lg font-bold">
                  {account.initials}
                </Text>
              </View>
              <View>
                <Text className="text-white text-sm font-bold">
                  {account.name}
                </Text>
                <Text className="text-neutral-500 text-xs mt-0.5">
                  {account.email}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Add More Accounts Button */}
        <View className="px-5 pb-10">
          <LinearGradient
            colors={[...GRADIENT_COLORS]}
            locations={[...GRADIENT_LOCATIONS]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ borderRadius: 28, padding: 2 }}
          >
            <TouchableOpacity
              className="rounded-full items-center py-4 bg-neutral-950"
              onPress={() => router.push("/ig-connect" as any)}
              activeOpacity={0.8}
            >
              <Text className="text-white text-base font-semibold">
                Add more accounts
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </SafeAreaView>
  );
}
