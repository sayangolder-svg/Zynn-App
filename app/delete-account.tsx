import { useAlert } from "@/components/app-alert";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import { clearAuthToken } from "@/lib/session";
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

const REASONS = [
  "I'm not earning enough",
  "I found a better platform",
  "I don't use Instagram anymore",
  "Privacy concerns",
  "Too complicated to use",
  "Other",
];

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizedConfirm = confirmText.trim().toUpperCase();
  const hasOtherReason =
    selectedReason !== "Other" || otherReason.trim().length > 0;
  const canDelete = !!selectedReason && hasOtherReason && normalizedConfirm === "DELETE";

  const handleDelete = () => {
    if (!selectedReason) {
      showAlert("Missing reason", "Please select a reason for deletion.");
      return;
    }
    if (selectedReason === "Other" && !otherReason.trim()) {
      showAlert("Missing reason", "Please specify your reason.");
      return;
    }
    if (normalizedConfirm !== "DELETE") {
      showAlert("Confirm deletion", "Type DELETE to confirm.");
      return;
    }

    showAlert(
      "Final Confirmation",
      "This will permanently delete your account, all earnings data, bank details, and campaign history. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await api.post("/delete-account/", {
                reason: selectedReason,
                other_reason: otherReason.trim(),
                confirm_text: normalizedConfirm,
              });
              await clearAuthToken();
              showAlert("Account Deleted", "Your account has been deleted.", [
                {
                  text: "OK",
                  onPress: () => router.replace("/(auth)/landing" as any),
                },
              ]);
            } catch (error: unknown) {
              showAlert(
                "Error",
                error instanceof Error ? error.message : "Failed to delete account",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { dismissable: false },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Delete Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-between">
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Warning */}
            <View className="bg-red-950/40 rounded-2xl p-5 mt-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="warning-outline" size={22} color="#f87171" />
                <Text className="text-red-400 text-base font-bold ml-2">
                  This action is permanent
                </Text>
              </View>
              <Text className="text-red-300/80 text-sm leading-5">
                Deleting your account will permanently remove all your data
                including:
              </Text>
              <View className="mt-3">
                {[
                  "All earnings history and pending payouts",
                  "Connected Instagram accounts",
                  "Bank account details",
                  "All reel campaigns and analytics",
                  "Your profile and personal information",
                ].map((item, index) => (
                  <View key={index} className="flex-row items-start mb-1.5">
                    <Text className="text-red-400 text-sm mr-2">•</Text>
                    <Text className="text-red-300/70 text-sm">{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Reason Selection */}
            <Text className="text-neutral-400 text-sm mt-6 mb-3">
              Please tell us why you&apos;re leaving
            </Text>
            {REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                onPress={() => setSelectedReason(reason)}
                activeOpacity={0.7}
                className={`flex-row items-center rounded-xl px-4 py-3.5 mb-2 ${
                  selectedReason === reason
                    ? "bg-neutral-800 border border-amber-500/50"
                    : "bg-neutral-900"
                }`}
              >
                <View
                  className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                    selectedReason === reason
                      ? "border-amber-500"
                      : "border-neutral-600"
                  }`}
                >
                  {selectedReason === reason && (
                    <View className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  )}
                </View>
                <Text className="text-white text-sm">{reason}</Text>
              </TouchableOpacity>
            ))}

            {selectedReason === "Other" && (
              <TextInput
                className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base mt-2"
                placeholderTextColor="#555"
                placeholder="Please specify your reason"
                value={otherReason}
                onChangeText={setOtherReason}
                multiline
              />
            )}

            {/* Confirmation */}
            <View className="mt-6">
              <Text className="text-neutral-400 text-sm mb-2">
                Type <Text className="text-red-400 font-bold">DELETE</Text> to
                confirm
              </Text>
              <TextInput
                className="bg-neutral-800 rounded-xl px-4 py-3.5 text-white text-base"
                placeholderTextColor="#555"
                placeholder="DELETE"
                value={confirmText}
                onChangeText={setConfirmText}
                autoCapitalize="characters"
              />
            </View>
          </ScrollView>

          {/* Delete Button */}
          <View className="px-5 pb-8">
            {canDelete ? (
              <TouchableOpacity
                className="rounded-full items-center justify-center py-4 bg-red-600 flex-row gap-2"
                activeOpacity={0.7}
                onPress={handleDelete}
                disabled={loading}
              >
                {loading ? <ActivityIndicator size="small" color="#fff" /> : null}
                <Text className="text-white text-base font-semibold">
                  {loading ? "Deleting..." : "Delete My Account"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="rounded-full items-center py-4 bg-neutral-800">
                <Text className="text-neutral-500 text-base font-semibold">
                  Delete my Account
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
