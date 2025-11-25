import { Colors } from "@/constants/Colors";
import { type Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserProfile from "./UserProfile";
import Tabs from "./Tabs";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Thread from "./Thread";

interface ProfileProps {
  showBackButton?: boolean;
  userId: Id<"users">;
}

const Profile: React.FC<ProfileProps> = ({ userId, showBackButton }) => {
  const { userProfile } = useUserProfile();
  const { top } = useSafeAreaInsets();
  const { signOut } = useAuth();
  const router = useRouter();

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    { userId: (userId || undefined) ?? userProfile?._id },
    {
      initialNumItems: 5,
    },
  );
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={results}
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
        ListEmptyComponent={
          <Text style={styles.tabContentText}>
            You haven&apos;t posted anything yet.
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: Colors.border,
            }}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={router.back}
                >
                  <Ionicons
                    name={"chevron-back"}
                    size={24}
                    color={Colors.black}
                  />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name={"web"} size={24} />
              )}

              <View style={styles.headerIcons}>
                <Ionicons
                  name={"logo-instagram"}
                  size={24}
                  color={Colors.black}
                />
                <TouchableOpacity onPress={() => void signOut()}>
                  <Ionicons
                    name={"log-out-outline"}
                    size={24}
                    color={Colors.black}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {userId ? (
              <UserProfile userId={userId} />
            ) : (
              <UserProfile userId={userProfile?._id as Id<"users">} />
            )}

            <Tabs onTabsChange={() => {}} />
          </>
        }
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  backText: {
    fontSize: 16,
  },
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerIcons: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  tabContentText: {
    alignSelf: "center",
    color: Colors.border,
    fontSize: 16,
    marginVertical: 16,
  },
});
