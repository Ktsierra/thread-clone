import {
  FlatList,
  StyleSheet,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  Image,
  type ImageSourcePropType,
} from "react-native";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import ThreadComposer from "@/components/ThreadComposer";
import { router, Stack, useRouter } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import Thread from "@/components/Thread";

const Feed = () => {
  // Sentry test Errors
  // const testError = () => {
  //   try {
  //     throw new Error("Test Error 2");
  //   } catch (error) {
  //     const sentryID = Sentry.captureMessage("Test Error Captured");
  //     console.log("sentryID:", sentryID);
  //
  //     const userFeedback: Sentry.SendFeedbackParams = {
  //       // event_id: sentryID,
  //       name: "John Doe 2",
  //       email: "john.doe22@example.com",
  //       message: "This is a test error2",
  //     };
  //
  //     Sentry.captureFeedback(userFeedback);
  //   }
  // };

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    {},
    {
      initialNumItems: 5,
    },
  );
  const [refreshing, setRefreshing] = useState(false);
  const { top } = useSafeAreaInsets();

  const onLoadMore = () => {
    loadMore(5);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // loadMore(5);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <FlatList
      data={results}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <Thread thread={item} />}
      keyExtractor={(item) => item._id}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={refreshing}
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: Colors.border,
          }}
        />
      )}
      contentContainerStyle={{ paddingVertical: top }}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Image
            source={
              require("@/assets/images/threads-logo-black.png") as ImageSourcePropType
            }
            style={styles.logo}
          />
          <TouchableOpacity
            onPress={() => router.push("/(auth)/(modal)/create")}
          >
            <ThreadComposer isPreview={true} />
          </TouchableOpacity>
        </View>
      }
    />
  );
};

export default Feed;

const styles = StyleSheet.create({
  listHeader: { paddingBottom: 16 },
  logo: {
    alignSelf: "center",
    height: 40,
    width: 40,
  },
});
