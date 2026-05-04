import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconBg?: string;
}) {
  return (
    <View className="flex-1 bg-neutral-900 rounded-2xl px-3 py-4 items-center">
      <View className="rounded-full px-3 py-1 mb-2 flex-row items-center bg-neutral-800">
        <Ionicons name={icon} size={12} color="#fff" />
        <Text className="text-white text-[10px] font-semibold ml-1 uppercase">
          {label}
        </Text>
      </View>
      <Text className="text-white text-xl font-bold">{value}</Text>
    </View>
  );
}

export default StatCard;
