import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Text, View } from "react-native";

const SLIDER_HEIGHT = 56;
const THUMB_SIZE = 44;
const HORIZONTAL_PADDING = 6;

interface SlideToActivateProps {
  onActivate: () => void;
  label?: string;
}

export default function SlideToActivate({
  onActivate,
  label = "Slide to activate the campaign",
}: SlideToActivateProps) {
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get("window").width - 40,
  );
  const maxSlide = containerWidth - THUMB_SIZE - HORIZONTAL_PADDING * 2;
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = Math.max(0, Math.min(gestureState.dx, maxSlide));
        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= maxSlide * 0.8) {
          Animated.spring(translateX, {
            toValue: maxSlide,
            useNativeDriver: true,
          }).start(() => {
            onActivate();
            Animated.timing(translateX, {
              toValue: 0,
              duration: 220,
              useNativeDriver: true,
            }).start();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const textOpacity = translateX.interpolate({
    inputRange: [0, maxSlide * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      <LinearGradient
        colors={[
          "#FB812F",
          "#FD963A",
          "#F4B85E",
          "#CEBE8D",
          "#BBBE9F",
          "#A1B4C1",
          "#868AC4",
        ]}
        locations={[0, 0.16, 0.31, 0.44, 0.53, 0.69, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          borderRadius: SLIDER_HEIGHT / 2,
          padding: 2,
        }}
      >
        <View
          style={{
            height: SLIDER_HEIGHT,
            borderRadius: SLIDER_HEIGHT / 2,
            backgroundColor: "#1a1a1a",
            justifyContent: "center",
            paddingHorizontal: HORIZONTAL_PADDING,
          }}
        >
          {/* Label */}
          <Animated.View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              alignItems: "center",
              opacity: textOpacity,
            }}
          >
            <Text style={{ color: "#999", fontSize: 14, fontWeight: "500" }}>
              {label}
            </Text>
          </Animated.View>

          {/* Thumb */}
          <Animated.View
            {...panResponder.panHandlers}
            style={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ translateX }],
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={["#FB812F", "#FD963A", "#F4B85E"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: THUMB_SIZE / 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="play" size={20} color="#fff" />
            </LinearGradient>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}
