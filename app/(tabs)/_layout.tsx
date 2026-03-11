import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

function AnimatedTabIcon({
  focused,
  color,
  focusedName,
  outlineName,
}: {
  focused: boolean;
  color: string;
  focusedName: keyof typeof Ionicons.glyphMap;
  outlineName: keyof typeof Ionicons.glyphMap;
}) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.85)).current;
  const opacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1 : 0.85,
        useNativeDriver: true,
        friction: 5,
        tension: 120,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        height: 32,
        width: 60,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.1)",
          opacity,
        }}
      />
      <Ionicons
        name={focused ? focusedName : outlineName}
        size={22}
        color={color}
      />
    </Animated.View>
  );
}

export default function TabsLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
        tabBarStyle: {
          backgroundColor: "#000",
          borderBottomColor: "#262626",
          borderBottomWidth: 0.5,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          textTransform: "none",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "transparent",
          height: 0,
        },
        tabBarItemStyle: {
          flexDirection: "column",
          alignItems: "center",
          paddingVertical: 6,
        },
        tabBarShowIcon: true,
      }}
      tabBarPosition="bottom"
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              focusedName="home"
              outlineName="home-outline"
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="reels"
        options={{
          title: "Add Reel",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              focusedName="add-circle"
              outlineName="add-circle-outline"
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              focusedName="stats-chart"
              outlineName="stats-chart-outline"
            />
          ),
        }}
      />
      <MaterialTopTabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              focusedName="settings"
              outlineName="settings-outline"
            />
          ),
        }}
      />
    </MaterialTopTabs>
  );
}
