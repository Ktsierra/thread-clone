import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { type Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Thread from "@/components/Thread";
import ThreadComposer from "../create";
import { Colors } from "@/constants/Colors";

type NonNullish<T> = NonNullable<T>;

function assertNonNullish<T>(v: T): asserts v is NonNullish<T> {
  if (v === null || v === undefined) {
    throw new Error("Value is null or undefined");
  } else return;
}

const Page = () => {
  const { id } = useLocalSearchParams<{
    id: Id<"messages">;
  }>();
  const thread = useQuery(api.messages.getThreadById, { messageId: id });

  try {
    assertNonNullish(thread);
  } catch {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <Thread thread={thread} />
      <View style={styles.line} />
      <ThreadComposer isReply threadId={id} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  line: {
    backgroundColor: Colors.border,
    height: StyleSheet.hairlineWidth,
  },
});
