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

interface BankAccount {
  id: number;
  bank_name: string;
  account_number: string;
  masked_account_number: string;
  ifsc: string;
  pan: string;
  holder_name: string;
  is_default: boolean;
}

interface EarningsSummary {
  total_earnings: string;
  credited: string;
  pending: string;
  bank_accounts: BankAccount[];
}

function EarningsSkeleton() {
  return (
    <View>
      <View className="bg-neutral-900 rounded-2xl items-center py-5 mt-3">
        <Skeleton className="w-28 h-4 rounded-full mb-3" />
        <Skeleton className="w-44 h-8 rounded-lg" />
      </View>

      <View className="flex-row gap-3 mt-3">
        <Skeleton className="flex-1 h-20 rounded-2xl" />
        <Skeleton className="flex-1 h-20 rounded-2xl" />
      </View>

      {[0, 1].map((idx) => (
        <View
          key={idx}
          className="mt-4 rounded-2xl border border-neutral-800 p-4"
        >
          <View className="flex-row items-center justify-between mb-3">
            <Skeleton className="w-32 h-4 rounded-md" />
            <Skeleton className="w-10 h-4 rounded-md" />
          </View>
          <Skeleton className="w-3/4 h-3 rounded-md mb-2" />
          <Skeleton className="w-2/3 h-3 rounded-md mb-2" />
          <Skeleton className="w-1/2 h-3 rounded-md mb-2" />
          <Skeleton className="w-2/3 h-3 rounded-md" />
        </View>
      ))}
    </View>
  );
}

export default function EarningsScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSummary = useCallback(async (showSkeleton: boolean) => {
    try {
      if (showSkeleton) setIsLoading(true);
      const data = await api.get<EarningsSummary>("/earnings/summary/");
      setSummary(data);
    } catch (error) {
      showAlert(
        "Error",
        error instanceof Error ? error.message : "Failed to load earnings",
      );
    } finally {
      if (showSkeleton) setIsLoading(false);
    }
  }, [showAlert]);

  useFocusEffect(
    useCallback(() => {
      void loadSummary(true);
    }, [loadSummary]),
  );

  const setDefault = async (id: number) => {
    try {
      await api.post(`/bank-accounts/${id}/set-default/`);
      await loadSummary(false);
    } catch (error) {
      showAlert(
        "Error",
        error instanceof Error ? error.message : "Failed to set default account",
      );
    }
  };

  const deleteAccount = (id: number) => {
    showAlert(
      "Delete Account",
      "Are you sure you want to remove this bank account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            api
              .delete(`/bank-accounts/${id}/`)
              .then(() => loadSummary(false))
              .catch((error: unknown) =>
                showAlert(
                  "Error",
                  error instanceof Error ? error.message : "Failed to delete account",
                ),
              );
          },
        },
      ],
      { dismissable: false },
    );
  };

  const accounts = summary?.bank_accounts ?? [];
  const hasBankAccounts = accounts.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Earnings</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700"
          onPress={() => router.push("/notifications" as any)}
        >
          <Ionicons name="notifications-outline" size={20} color="#aaa" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !summary ? (
          <EarningsSkeleton />
        ) : (
          <>
            <View className="bg-neutral-900 rounded-2xl items-center py-5 mt-3">
              <View className="flex-row items-center bg-neutral-800 rounded-full px-3 py-1 mb-2">
                <Ionicons name="wallet-outline" size={12} color="#4ade80" />
                <Text className="text-green-400 text-[10px] font-semibold ml-1">
                  Total Earnings
                </Text>
              </View>
              <Text className="text-white text-3xl font-bold">
                Rs {summary?.total_earnings ?? "0.00"}
              </Text>
            </View>

            {!hasBankAccounts ? (
              <View className="items-center mt-6">
                <LinearGradient
                  colors={[...GRADIENT_COLORS]}
                  locations={[...GRADIENT_LOCATIONS]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ borderRadius: 28, padding: 2, width: "100%" }}
                >
                  <TouchableOpacity
                    className="rounded-full items-center py-4 bg-neutral-950"
                    onPress={() => router.push("/bank-details" as any)}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white text-base font-semibold">
                      Add bank account
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            ) : (
              <>
                <View className="flex-row gap-3 mt-3">
                  <View className="flex-1 bg-neutral-900 rounded-2xl items-center py-4">
                    <Text className="text-green-400 text-[10px] font-semibold uppercase">
                      Credited
                    </Text>
                    <Text className="text-green-400 text-xl font-bold">
                      Rs {summary?.credited}
                    </Text>
                  </View>
                  <View className="flex-1 bg-neutral-900 rounded-2xl items-center py-4">
                    <Text className="text-red-400 text-[10px] font-semibold uppercase">
                      Pending
                    </Text>
                    <Text className="text-red-400 text-xl font-bold">
                      Rs {summary?.pending}
                    </Text>
                  </View>
                </View>

                {accounts.map((account) => (
                  <View
                    key={account.id}
                    className="mt-4 rounded-2xl border p-4"
                    style={{
                      borderColor: account.is_default ? "#f59e0b" : "#404040",
                      borderWidth: 1.5,
                    }}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-white text-base font-bold">Account details</Text>
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/edit-bank-details" as any,
                            params: {
                              id: String(account.id),
                              bankName: account.bank_name,
                              accountNumber: account.account_number,
                              ifsc: account.ifsc,
                              pan: account.pan,
                              holderName: account.holder_name,
                            },
                          })
                        }
                      >
                        <Text className="text-white text-sm underline">Edit</Text>
                      </TouchableOpacity>
                    </View>

                    <Text className="text-neutral-400 text-sm leading-5">
                      Bank Name- {account.bank_name}
                    </Text>
                    <Text className="text-neutral-400 text-sm leading-5">
                      Acc no. - {account.masked_account_number}
                    </Text>
                    <Text className="text-neutral-400 text-sm leading-5">
                      IFSC- {account.ifsc}
                    </Text>
                    <Text className="text-neutral-400 text-sm leading-5">PAN- {account.pan}</Text>
                    <Text className="text-neutral-400 text-sm leading-5">
                      NAME- {account.holder_name}
                    </Text>

                    <View className="flex-row items-center justify-between mt-3">
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => setDefault(account.id)}
                      >
                        <View
                          className="w-5 h-5 rounded-full border-2 items-center justify-center mr-2"
                          style={{
                            borderColor: account.is_default ? "#f59e0b" : "#666",
                          }}
                        >
                          {account.is_default ? (
                            <View
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: "#f59e0b" }}
                            />
                          ) : null}
                        </View>
                        <Text className="text-neutral-400 text-sm">Use as default</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteAccount(account.id)}>
                        <Ionicons name="trash-outline" size={20} color="#888" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <LinearGradient
                  colors={[...GRADIENT_COLORS]}
                  locations={[...GRADIENT_LOCATIONS]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  className="mt-6 rounded-full"
                  style={{ borderRadius: 28, padding: 2 }}
                >
                  <TouchableOpacity
                    className="rounded-full items-center py-4 bg-neutral-950"
                    onPress={() => router.push("/bank-details" as any)}
                    activeOpacity={0.8}
                  >
                    <Text className="text-white text-base font-semibold">
                      Add new bank account
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
