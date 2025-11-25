import Thread from "@/components/Thread";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: Id<"messages"> }>();
  const thread = useQuery(api.messages.getThreadById, { messageId: id });

  return (
    <View>
      <ScrollView>
        {thread ? <Thread thread={thread} /> : <ActivityIndicator />}
      </ScrollView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
