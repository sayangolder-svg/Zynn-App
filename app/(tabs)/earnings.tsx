import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
  id: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  pan: string;
  holderName: string;
  isDefault: boolean;
}

export default function EarningsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    newAccount?: string;
  }>();

  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  // Listen for newly added bank account from bank-details form
  useEffect(() => {
    if (params.newAccount) {
      try {
        const parsed = JSON.parse(params.newAccount) as Omit<
          BankAccount,
          "id" | "isDefault"
        >;
        const newAcc: BankAccount = {
          ...parsed,
          id: Date.now().toString(),
          isDefault: accounts.length === 0, // first account is default
        };
        setAccounts((prev) => {
          // Avoid duplicates on re-render
          if (
            prev.some(
              (a) =>
                a.accountNumber === parsed.accountNumber &&
                a.ifsc === parsed.ifsc,
            )
          ) {
            return prev;
          }
          return prev.length === 0
            ? [{ ...newAcc, isDefault: true }]
            : [...prev, newAcc];
        });
      } catch {
        // ignore parse errors
      }
    }
  }, [params.newAccount]);

  const hasBankAccounts = accounts.length > 0;

  const setDefault = (id: string) => {
    setAccounts((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const deleteAccount = (id: string) => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to remove this bank account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setAccounts((prev) => {
              const filtered = prev.filter((a) => a.id !== id);
              // If deleted account was default, make first remaining one default
              if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
                filtered[0].isDefault = true;
              }
              return filtered;
            }),
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
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
        {/* Total Earnings Card */}
        <View className="bg-neutral-900 rounded-2xl items-center py-5 mt-3">
          <View className="flex-row items-center bg-neutral-800 rounded-full px-3 py-1 mb-2">
            <Ionicons name="wallet-outline" size={12} color="#4ade80" />
            <Text className="text-green-400 text-[10px] font-semibold ml-1">
              Total Earnings
            </Text>
          </View>
          <Text className="text-white text-3xl font-bold">₹12,450</Text>
        </View>

        {!hasBankAccounts ? (
          /* ─── No Bank Accounts View ─── */
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
            <Text className="text-neutral-500 text-sm mt-3 text-center">
              Add bank account to automatically claim your earnings.
            </Text>
          </View>
        ) : (
          /* ─── Has Bank Accounts View ─── */
          <>
            {/* Credited & Pending */}
            <View className="flex-row gap-3 mt-3">
              <View className="flex-1 bg-neutral-900 rounded-2xl items-center py-4">
                <View className="flex-row items-center bg-neutral-800 rounded-full px-3 py-1 mb-2">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={12}
                    color="#4ade80"
                  />
                  <Text className="text-green-400 text-[10px] font-semibold ml-1 uppercase">
                    Credited
                  </Text>
                </View>
                <Text className="text-green-400 text-xl font-bold">₹12400</Text>
              </View>
              <View className="flex-1 bg-neutral-900 rounded-2xl items-center py-4">
                <View className="flex-row items-center bg-neutral-800 rounded-full px-3 py-1 mb-2">
                  <Ionicons name="time-outline" size={12} color="#f87171" />
                  <Text className="text-red-400 text-[10px] font-semibold ml-1 uppercase">
                    Pending
                  </Text>
                </View>
                <Text className="text-red-400 text-xl font-bold">₹12400</Text>
              </View>
            </View>

            {/* Bank Accounts */}
            {accounts.map((account) => (
              <View
                key={account.id}
                className="mt-4 rounded-2xl border p-4"
                style={{
                  borderColor: account.isDefault ? "#f59e0b" : "#404040",
                  borderWidth: 1.5,
                }}
              >
                {/* Card Header */}
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-white text-base font-bold">
                    Account details
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/edit-bank-details" as any,
                        params: {
                          id: account.id,
                          bankName: account.bankName,
                          accountNumber: account.accountNumber,
                          ifsc: account.ifsc,
                          pan: account.pan,
                          holderName: account.holderName,
                        },
                      })
                    }
                  >
                    <Text className="text-white text-sm underline">Edit</Text>
                  </TouchableOpacity>
                </View>

                {/* Details */}
                <Text className="text-neutral-400 text-sm leading-5">
                  Bank Name- {account.bankName}
                </Text>
                <Text className="text-neutral-400 text-sm leading-5">
                  Acc no. _ {account.accountNumber}
                </Text>
                <Text className="text-neutral-400 text-sm leading-5">
                  IFSC- {account.ifsc}
                </Text>
                <Text className="text-neutral-400 text-sm leading-5">
                  PAN- {account.pan}
                </Text>
                <Text className="text-neutral-400 text-sm leading-5">
                  NAME- {account.holderName}
                </Text>

                {/* Footer */}
                <View className="flex-row items-center justify-between mt-3">
                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => setDefault(account.id)}
                  >
                    <View
                      className="w-5 h-5 rounded-full border-2 items-center justify-center mr-2"
                      style={{
                        borderColor: account.isDefault ? "#f59e0b" : "#666",
                      }}
                    >
                      {account.isDefault && (
                        <View
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: "#f59e0b" }}
                        />
                      )}
                    </View>
                    <Text className="text-neutral-400 text-sm">
                      Use as default
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteAccount(account.id)}>
                    <Ionicons name="trash-outline" size={20} color="#888" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Add New Bank Account */}
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
      </ScrollView>
    </SafeAreaView>
  );
}
