/* eslint-disable react-native/no-inline-styles */
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: Colors.white,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="profile/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Thread",
          headerShadowVisible: false,
          headerBackTitle: "Back",
          headerRight: () => (
            <Ionicons
              name={"notifications-outline"}
              size={24}
              style={{ marginLeft: 6 }}
              color={Colors.black}
            />
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
