import { LinearGradient } from "expo-linear-gradient";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type AlertActionStyle = "default" | "cancel" | "destructive";

type AlertAction = {
  text: string;
  onPress?: () => void;
  style?: AlertActionStyle;
};

type AlertPayload = {
  title: string;
  message?: string;
  actions: AlertAction[];
  dismissable: boolean;
};

type ShowAlertOptions = {
  dismissable?: boolean;
};

type AlertContextValue = {
  showAlert: (
    title: string,
    message?: string,
    actions?: AlertAction[],
    options?: ShowAlertOptions,
  ) => void;
};

const AlertContext = createContext<AlertContextValue | null>(null);

export function useAlert(): AlertContextValue {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<AlertPayload | null>(null);
  const queueRef = useRef<AlertPayload[]>([]);
  const currentRef = useRef<AlertPayload | null>(null);

  currentRef.current = current;

  const showNext = useCallback(() => {
    const next = queueRef.current.shift() || null;
    setCurrent(next);
  }, []);

  const closeAlert = useCallback(() => {
    setCurrent(null);
    setTimeout(showNext, 120);
  }, [showNext]);

  const showAlert = useCallback<AlertContextValue["showAlert"]>(
    (title, message, actions, options) => {
      const normalizedActions = actions && actions.length > 0 ? actions : [{ text: "OK" }];
      const payload: AlertPayload = {
        title,
        message,
        actions: normalizedActions,
        dismissable: options?.dismissable ?? true,
      };

      if (currentRef.current) {
        queueRef.current.push(payload);
        return;
      }

      setCurrent(payload);
    },
    [],
  );

  const handleActionPress = useCallback(
    (action: AlertAction) => {
      closeAlert();
      if (action.onPress) {
        setTimeout(() => action.onPress?.(), 150);
      }
    },
    [closeAlert],
  );

  const hasDestructive = current?.actions.some((action) => action.style === "destructive") ?? false;
  const accentColors = hasDestructive
    ? ["#ef4444", "#f97316"]
    : ["#FB812F", "#FD963A", "#F4B85E", "#CEBE8D"];

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        animationType="fade"
        transparent
        visible={!!current}
        onRequestClose={() => (current?.dismissable ? closeAlert() : null)}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-6">
          {current?.dismissable ? (
            <Pressable className="absolute inset-0" onPress={closeAlert} />
          ) : null}
          <View className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
            <LinearGradient
              colors={accentColors}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ height: 3 }}
            />
            <View className="px-5 pt-4 pb-5">
              <Text className="text-white text-lg font-semibold">
                {current?.title}
              </Text>
              {current?.message ? (
                <Text className="text-neutral-400 text-sm mt-2">
                  {current.message}
                </Text>
              ) : null}
              <View
                className={`mt-6 flex-row ${
                  current?.actions.length === 1 ? "" : "gap-3"
                }`}
              >
                {current?.actions.map((action, index) => {
                  const actionStyle = action.style ?? "default";
                  const isSingle = (current?.actions.length || 0) === 1;
                  const buttonClasses =
                    actionStyle === "destructive"
                      ? "bg-red-600"
                      : actionStyle === "cancel"
                        ? "border border-neutral-700"
                        : "bg-white";
                  const textClasses =
                    actionStyle === "destructive"
                      ? "text-white"
                      : actionStyle === "cancel"
                        ? "text-white"
                        : "text-black";

                  return (
                    <TouchableOpacity
                      key={`${action.text}-${index}`}
                      className={`h-11 rounded-full items-center justify-center ${
                        isSingle ? "flex-1" : "flex-1"
                      } ${buttonClasses}`}
                      onPress={() => handleActionPress(action)}
                      activeOpacity={0.8}
                    >
                      <Text className={`text-sm font-semibold ${textClasses}`}>
                        {action.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}
