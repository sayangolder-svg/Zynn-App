import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
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

export default function EditBankDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    pan: string;
    holderName: string;
  }>();

  const [accountNumber, setAccountNumber] = useState(
    params.accountNumber ?? "",
  );
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(
    params.accountNumber ?? "",
  );
  const [ifsc, setIfsc] = useState(params.ifsc ?? "");
  const [pan, setPan] = useState(params.pan ?? "");
  const [holderName, setHolderName] = useState(params.holderName ?? "");

  const handleSave = () => {
    if (
      !accountNumber ||
      !confirmAccountNumber ||
      !ifsc ||
      !pan ||
      !holderName
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      Alert.alert("Error", "Account numbers do not match.");
      return;
    }
    // TODO: persist updated bank details
    Alert.alert("Success", "Bank details updated successfully.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Edit Bank details</Text>
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
              className="rounded-full items-center py-4 bg-neutral-950"
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text className="text-white text-base font-semibold">Save</Text>
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
