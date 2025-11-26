import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Thread from "./Thread";

const Comments = ({ threadId }: { threadId: Id<"messages"> }) => {
  const comments = useQuery(api.messages.getComments, {
    messageId: threadId,
  });
  return (
    <View>
      {comments?.map((comment) => (
        <Thread key={comment._id} thread={comment} />
      ))}
    </View>
  );
};

export default Comments;

const styles = StyleSheet.create({});
