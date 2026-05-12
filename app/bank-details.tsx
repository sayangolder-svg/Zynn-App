import { useAlert } from "@/components/app-alert";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

export default function BankDetailsScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();

  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [pan, setPan] = useState("");
  const [holderName, setHolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (
      !accountNumber ||
      !confirmAccountNumber ||
      !ifsc ||
      !pan ||
      !holderName
    ) {
      showAlert("Error", "Please fill in all fields.");
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      showAlert("Error", "Account numbers do not match.");
      return;
    }
    try {
      setLoading(true);
      await api.post("/bank-accounts/", {
        bank_name: ifsc.substring(0, 4).toUpperCase(),
        account_number: accountNumber,
        ifsc: ifsc.toUpperCase(),
        pan: pan.toUpperCase(),
        holder_name: holderName.toUpperCase(),
      });
      router.replace("/(tabs)/earnings" as any);
    } catch (error) {
      showAlert(
        "Error",
        error instanceof Error ? error.message : "Failed to save bank details",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Bank details</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Account Number */}
          <View className="mt-6">
            <Text className="text-neutral-400 text-sm mb-2">
              Account number
            </Text>
            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
              placeholderTextColor="#555"
              keyboardType="number-pad"
              value={accountNumber}
              onChangeText={setAccountNumber}
              secureTextEntry
            />
          </View>

          {/* Confirm Account Number */}
          <View className="mt-5">
            <Text className="text-neutral-400 text-sm mb-2">
              Re-enter bank account number
            </Text>
            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
              placeholderTextColor="#555"
              keyboardType="number-pad"
              value={confirmAccountNumber}
              onChangeText={setConfirmAccountNumber}
            />
          </View>

          {/* IFSC Code */}
          <View className="mt-5">
            <Text className="text-neutral-400 text-sm mb-2">IFSC code</Text>
            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
              placeholderTextColor="#555"
              autoCapitalize="characters"
              value={ifsc}
              onChangeText={setIfsc}
            />
          </View>

          {/* PAN Details */}
          <View className="mt-5">
            <Text className="text-neutral-400 text-sm mb-2">Pan Details</Text>
            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
              placeholderTextColor="#555"
              autoCapitalize="characters"
              value={pan}
              onChangeText={setPan}
            />
          </View>

          {/* Account Holder Name */}
          <View className="mt-5">
            <Text className="text-neutral-400 text-sm mb-2">
              Account holder name
            </Text>
            <TextInput
              className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
              placeholderTextColor="#555"
              autoCapitalize="words"
              value={holderName}
              onChangeText={setHolderName}
            />
          </View>

          {/* Save Button */}
          <LinearGradient
            colors={[...GRADIENT_COLORS]}
            locations={[...GRADIENT_LOCATIONS]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="mt-10 rounded-full"
            style={{ borderRadius: 28, padding: 2 }}
          >
            <TouchableOpacity
              className="rounded-full items-center justify-center py-4 bg-neutral-950 flex-row gap-2"
              onPress={handleSave}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
              <Text className="text-white text-base font-semibold">
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Cancel */}
          <TouchableOpacity
            className="mt-3 items-center py-3"
            onPress={() => router.back()}
          >
            <Text className="text-neutral-400 text-base">Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
