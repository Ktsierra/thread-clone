/* eslint-disable react-native/no-inline-styles */
import Comments from "@/components/Comments";
import Thread from "@/components/Thread";
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "convex/react";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Page = () => {
  const { id } = useLocalSearchParams<{
    id: Id<"messages">;
  }>();
  const thread = useQuery(api.messages.getThreadById, { messageId: id });
  const { userProfile } = useUserProfile();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        marginBottom: 0,
      },
    });
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {thread ? <Thread thread={thread} /> : <ActivityIndicator />}
        {thread && <Comments threadId={thread._id} />}
      </ScrollView>

      <View style={styles.border} />

      <Link
        href={{
          pathname: "/reply/[id]",
          params: { id: id },
        }}
        asChild
      >
        <TouchableOpacity style={styles.replyButton}>
          <Image
            source={{ uri: userProfile?.imageUrl as string }}
            style={styles.avatar}
          />
          <Text> Reply to {thread?.creator.first_name}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 15,
    height: 25,
    width: 25,
  },
  border: {
    backgroundColor: Colors.border,
    height: StyleSheet.hairlineWidth,
    marginVertical: 2,
  },
  replyButton: {
    alignItems: "center",
    backgroundColor: Colors.itemBackground,
    borderRadius: 100,
    flexDirection: "row",
    gap: 5,
    margin: 10,
    padding: 8,
  },
});
