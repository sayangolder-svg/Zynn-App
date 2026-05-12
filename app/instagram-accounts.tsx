import { useAlert } from "@/components/app-alert";
import Skeleton from "@/components/skeleton";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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
  id: number;
  username: string;
  is_verified: boolean;
}

export default function InstagramAccountsScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [accounts, setAccounts] = useState<IGAccount[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAccounts = useCallback(async (showSkeleton = accounts.length === 0) => {
    try {
      if (showSkeleton) setIsLoading(true);
      const data = await api.get<IGAccount[]>("/instagram-accounts/");
      setAccounts(data);
    } catch (error) {
      showAlert(
        "Error",
        error instanceof Error ? error.message : "Failed to load accounts",
      );
    } finally {
      if (showSkeleton) setIsLoading(false);
    }
  }, [accounts.length, showAlert]);

  const handleDeleteAccount = (account: IGAccount) => {
    const message = `Are you sure you want to remove @${account.username}? This will revoke verification for this account.`;

    showAlert(
      "Remove Account",
      message,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setDeleting(account.id);
            try {
              console.log(`[DEBUG] Deleting account ${account.id}`);
              const response = await api.delete(`/instagram-accounts/${account.id}/`);
              console.log(`[DEBUG] Delete response:`, response);
              setAccounts((current) => current.filter((a) => a.id !== account.id));
              showAlert("Success", `@${account.username} has been removed.`);
            } catch (error) {
              console.error(`[DEBUG] Delete error:`, error);
              showAlert(
                "Error",
                error instanceof Error ? error.message : "Failed to remove account",
              );
            } finally {
              setDeleting(null);
            }
          },
        },
      ],
      { dismissable: false },
    );
  };

  useFocusEffect(
    useCallback(() => {
      void loadAccounts();
    }, [loadAccounts]),
  );

  const showSkeleton = isLoading && accounts.length === 0;

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
          {showSkeleton ? (
            <View>
              {[0, 1, 2].map((idx) => (
                <View
                  key={idx}
                  className="bg-neutral-900 rounded-2xl flex-row items-center justify-between px-4 py-4 mb-3"
                >
                  <View className="flex-row items-center flex-1">
                    <Skeleton className="w-12 h-12 rounded-full mr-3" />
                    <View className="flex-1">
                      <Skeleton className="w-32 h-4 rounded-md" />
                      <Skeleton className="w-40 h-3 rounded-md mt-2" />
                    </View>
                  </View>
                  <Skeleton className="w-6 h-6 rounded-full" />
                </View>
              ))}
            </View>
          ) : (
            accounts.map((account) => (
              <View
                key={account.id}
                className="bg-neutral-900 rounded-2xl flex-row items-center justify-between px-4 py-4 mb-3"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-neutral-600 items-center justify-center mr-3">
                    <Text className="text-white text-lg font-bold">
                      {account.username.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white text-sm font-bold">
                      @{account.username}
                    </Text>
                    <Text className="text-neutral-500 text-xs mt-0.5">
                      {account.is_verified ? "Verified" : "Pending verification"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteAccount(account)}
                  disabled={deleting === account.id}
                  activeOpacity={0.6}
                  className="p-2 -mr-2"
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color={deleting === account.id ? "#999" : "#ef4444"}
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
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
