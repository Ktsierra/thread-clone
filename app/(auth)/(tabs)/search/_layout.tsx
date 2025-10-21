import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
       />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({});
