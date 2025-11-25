import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  type ImageSourcePropType,
} from "react-native";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import ThreadComposer from "@/components/ThreadComposer";
import { Link, router, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import Thread from "@/components/Thread";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { scheduleOnRN } from "react-native-worklets";

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

  //Animation
  const navigation = useNavigation();
  const scrollOffset = useSharedValue(0);
  const lastScrollOffset = useSharedValue(0);
  const hiddenOffset = useSharedValue(0);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocus = useIsFocused();

  const updateTabBar = () => {
    // compute delta since last scroll and accumulate hidden offset
    const current = scrollOffset.value;
    const delta = current - lastScrollOffset.value;
    lastScrollOffset.value = current;

    if (current <= 0) {
      // At top: fully show tab bar
      hiddenOffset.value = 0;
    } else {
      // scroll down (delta > 0) increases hidden; scroll up (delta < 0) decreases hidden
      hiddenOffset.value = Math.min(
        Math.max(hiddenOffset.value + delta, 0),
        tabBarHeight,
      );
    }

    const newMarginBottom = -hiddenOffset.value;
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        marginBottom: newMarginBottom,
      },
    });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (isFocus) {
        scrollOffset.value = event.contentOffset.y;
        scheduleOnRN(updateTabBar);
      }
    },
  });

  return (
    <Animated.FlatList
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      data={results}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/feed/[id]",
            params: { id: item._id },
          }}
          asChild
        >
          <TouchableOpacity>
            <Thread thread={item} />
          </TouchableOpacity>
        </Link>
      )}
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
