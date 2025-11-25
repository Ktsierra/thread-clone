import Profile from "@/components/Profile";
import { type Id } from "@/convex/_generated/dataModel";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const Page = () => {
  const { id } = useLocalSearchParams();

  return <Profile userId={id as Id<"users">} showBackButton={true} />;
};

export default Page;

const styles = StyleSheet.create({});
