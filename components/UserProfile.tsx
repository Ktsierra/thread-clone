import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "convex/react";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface UserProfileProps {
  userId: Id<"users">;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const profile = useQuery(api.user.getUserById, { userId });
  const { userProfile } = useUserProfile();
  const isSelf = !!userProfile && userId === userProfile._id;

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileTextContainer}>
          <Text style={styles.name}>
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text style={styles.username}>@{profile?.username}</Text>
        </View>
        <Image
          source={{ uri: profile?.imageUrl as string }}
          style={styles.image}
        />
      </View>
      <Text style={styles.bio}>{profile?.bio ?? "No bio"}</Text>
      <Text style={{}}>
        {profile?.followersCount} · {profile?.websiteUrl ?? "No website"}
      </Text>

      <View style={styles.buttonRow}>
        {isSelf && (
          <>
            <Link
              href={{
                pathname: "/(auth)/(modal)/edit-profile",
                params: {
                  biostring: userProfile.bio,
                  linkstring: userProfile.websiteUrl,
                  imageUrl: userProfile.imageUrl,
                },
              }}
              asChild
            >
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Share Profile</Text>
            </TouchableOpacity>
          </>
        )}
        {!isSelf && (
          <>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.fullButtonText}>Mention</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  bio: {
    fontSize: 14,
    marginVertical: 16,
  },
  button: {
    alignItems: "center",
    borderColor: Colors.border,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-evenly",
    marginTop: 16,
  },
  buttonText: {
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  fullButton: {
    alignItems: "center",
    backgroundColor: Colors.black,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  fullButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  image: {
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileTextContainer: {
    gap: 6,
  },
  username: {
    color: Colors.border,
    fontSize: 14,
  },
});
