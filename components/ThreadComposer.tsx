/* eslint-disable react-native/no-inline-styles */
import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useUserProfile } from "@/hooks/useUserProfile";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  InputAccessoryView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ThreadComposerProps {
  isPreview?: boolean;
  isReply?: boolean;
  threadId?: Id<"messages">;
}

const ThreadComposer: React.FC<ThreadComposerProps> = ({
  isPreview,
  isReply,
  threadId,
}) => {
  const router = useRouter();
  const { userProfile } = useUserProfile();
  const [threadContent, setthreadContent] = useState("");
  // const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<string[] | null>(null);
  const InputAccessoryViewID = "threadPostId";

  const addThread = useMutation(api.messages.addThreadMessage);

  const handleSubmit = async () => {
    await addThread({
      threadId,
      content: threadContent,
      // mediaFiles,
      // websiteUrl,
    });
    removeThread();
    router.dismiss();
  };

  const removeThread = () => {
    setthreadContent("");
    setMediaFiles([]);
  };

  const handleCancel = () => {
    if (threadContent) {
      Alert.alert("Discard Thread?", "", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save Draft",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            removeThread();
            router.dismiss();
          },
        },
      ]);
    } else {
      router.dismiss();
    }
  };

  const selectImage = (type: "library" | "camera") => {
    console.log(":", type);
  };

  // const selectImage = (type: "library" | "camera") => {
  //   switch (type) {
  //     case "library":
  //       void pickImage();
  //       break;
  //
  //     default:
  //       break;
  //   }
  // };
  //
  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ["images"],
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //   });
  //   if (!result.canceled) {
  //     const uris = result.assets.map((asset) => asset.uri);
  //     setMediaFiles((prev) => (prev ? [...prev, ...uris] : uris));
  //   }
  // };
  return (
    <View>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.topRow}>
        <Image
          source={{ uri: String(userProfile?.imageUrl) }}
          style={styles.avatar}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.name}>
            {userProfile?.first_name} {userProfile?.last_name}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={isReply ? "Reply to thread" : "What's new"}
            value={threadContent}
            onChangeText={setthreadContent}
            multiline
            autoFocus={!isPreview}
            inputAccessoryViewID={InputAccessoryViewID}
          />

          {mediaFiles?.map((val, index) => (
            <Image source={{ uri: val }} key={index} style={styles.avatar} />
          ))}

          <View style={styles.iconRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("library")}
            >
              <Ionicons name="images-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => selectImage("camera")}
            >
              <Ionicons name="camera-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="gif" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="mic-outline" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <FontAwesome6 name="hashtag" size={24} color={Colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons
                name="stats-chart-outline"
                size={24}
                color={Colors.border}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.cancelButton,
            {
              opacity: isPreview ? 0 : 1,
            },
          ]}
          onPress={removeThread}
        >
          <Ionicons name={"close"} color={Colors.border} size={24} />
        </TouchableOpacity>
      </View>

      <InputAccessoryView nativeID={InputAccessoryViewID}>
        <View style={styles.keyboardAccessoryView}>
          <Text style={styles.keyboardAccessoryText}>
            {isReply
              ? "Everyone can reply and quote"
              : "Profiles that you follow can reply and quote"}
          </Text>
          <TouchableOpacity
            onPress={() => void handleSubmit()}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </InputAccessoryView>
    </View>
  );
};

export default ThreadComposer;

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "flex-start",
    borderRadius: 25,
    height: 50,
    width: 50,
  },
  cancelButton: {
    alignSelf: "flex-start",
    padding: 12,
  },
  centerContainer: {
    flex: 1,
  },
  iconButton: {
    marginRight: 16,
  },
  iconRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  input: {
    fontSize: 16,
    maxHeight: 100,
  },
  keyboardAccessoryText: { color: Colors.border, flex: 1, textAlign: "center" },
  keyboardAccessoryView: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 12,
    paddingLeft: 64,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: Colors.black,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  topRow: {
    alignItems: "center",
    borderBottomColor: Colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    padding: 12,
  },
});
