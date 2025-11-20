/* eslint-disable react-native/no-inline-styles */
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: Colors.white,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name={"(modal)/create"}
        options={{
          presentation: "modal",
          title: "New Thread",
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons
                style={{ paddingHorizontal: 12 }}
                name={"ellipsis-horizontal"}
                size={24}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name={"(modal)/edit-profile"}
        options={{
          presentation: "modal",
          title: "Edit Profile",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name={"(modal)/image/[url]"}
        options={{
          presentation: "fullScreenModal",
          title: "",
          headerStyle: {
            backgroundColor: Colors.black,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.dismiss()}
              style={{ marginHorizontal: 6 }}
            >
              <Ionicons name={"close"} size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.dismiss()}
              style={{ marginHorizontal: 6 }}
            >
              <Ionicons
                name={"ellipsis-horizontal"}
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
