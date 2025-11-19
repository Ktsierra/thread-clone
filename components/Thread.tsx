/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { User } from "@/convex/schema";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Colors } from "@/constants/Colors";
import { Link } from "expo-router";
import { type Doc } from "@/convex/_generated/dataModel";

interface ThreadProps {
  thread: Doc<"messages"> & { creator: Doc<"users"> };
}

const Thread = ({ thread }: ThreadProps) => {
  const {
    content,
    mediaFiles,
    likeCount,
    commentCount,
    retweetCount,
    creator,
  } = thread;

  return (
    <View style={styles.container}>
      <Image source={{ uri: creator.imageUrl }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Link
              href={{
                pathname: "/(auth)/(tabs)/profile",
                params: { userId: creator._id, showBackButton: "true" },
              }}
              asChild
            >
              <Text style={styles.username}>
                {creator.first_name} {creator.last_name}
              </Text>
            </Link>
            <Text style={styles.timestamp}>
              {new Date(thread._creationTime).toLocaleDateString()}
            </Text>
          </View>
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={Colors.border}
            style={{ alignSelf: "flex-end" }}
          />
        </View>
        <Text style={styles.content}>{content}</Text>
        {/* {mediaFiles && mediaFiles.length > 0 && ( */}
        {/*   <ScrollView */}
        {/*     horizontal */}
        {/*     showsHorizontalScrollIndicator={false} */}
        {/*     contentContainerStyle={styles.mediaContainer} */}
        {/*   > */}
        {/*     {mediaFiles.map((imageUrl, index) => ( */}
        {/*       <Link */}
        {/*         href={`/(auth)/(modal)/image/${encodeURIComponent(imageUrl)}?threadId=${thread._id}&likeCount=${likeCount}&commentCount=${commentCount}&retweetCount=${retweetCount}`} */}
        {/*         key={index} */}
        {/*         asChild */}
        {/*       > */}
        {/*         <TouchableOpacity> */}
        {/*           <Image source={{ uri: imageUrl }} style={styles.mediaImage} /> */}
        {/*         </TouchableOpacity> */}
        {/*       </Link> */}
        {/*     ))} */}
        {/*   </ScrollView> */}
        {/* )} */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            /* onPress={() => likeThread({ messageId: thread._id })} */
          >
            <Ionicons name="heart-outline" size={24} color="black" />
            <Text style={styles.actionText}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.actionText}>{commentCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="repeat-outline" size={24} color="black" />
            <Text style={styles.actionText}>{retweetCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="send" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Thread;

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    flexDirection: "row",
  },

  actionText: {
    marginLeft: 5,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 10,
  },
  avatar: {
    borderRadius: 20,
    height: 40,
    marginRight: 10,
    width: 40,
  },
  container: {
    flexDirection: "row",
    padding: 15,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  headerText: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 4,
  },
  mediaContainer: {
    flexDirection: "row",
    gap: 14,
    paddingRight: 40,
  },
  mediaImage: {
    borderRadius: 10,
    height: 200,
    marginBottom: 10,
    width: 200,
  },
  timestamp: {
    color: Colors.border,
    fontSize: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
