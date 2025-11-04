import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Edit = () => {
  const { biostring, linkstring, userId, imageUrl } = useLocalSearchParams<{
    biostring: string;
    linkstring: string;
    userId: Id<"users">;
    imageUrl: string;
  }>();

  const [bio, setBio] = useState(biostring);
  const [link, setLink] = useState(linkstring);
  const [image, setImage] = useState(imageUrl);
  const [isModified, setIsModified] = useState(false);
  const updateUser = useMutation(api.user.updateUser);
  const router = useRouter();

  const onDone = async () => {
    if (!isModified) {
      router.dismiss();
      return;
    }

    await updateUser({
      // userId,
      bio,
      websiteUrl: link,
    });
    setIsModified(false);
    router.dismiss();
  };

  const modHandler = (event: string, callback: (text: string) => void) => {
    console.log(":", "test");
    setIsModified(true);
    callback(event);
  };

  const markChange =
    (setter: (text: string) => void, prevValue: string) => (text: string) => {
      if (text !== prevValue) setIsModified(true);
      setter(text);
    };

  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => void onDone()}>
              <Text>Done</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.section}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={markChange(setBio, bio)}
          multiline
          textAlignVertical={"top"}
          placeholder={"Tell us about yourself"}
          numberOfLines={4}
          style={styles.bioInput}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Link</Text>
        <TextInput
          value={link}
          onChangeText={setLink}
          placeholder={"https://www.example.com"}
          autoCapitalize={"none"}
        />
      </View>
    </View>
  );
};

export default Edit;

const styles = StyleSheet.create({
  bioInput: {
    fontSize: 14,
    fontWeight: 500,
    height: 100,
  },
  image: {
    alignSelf: "center",
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  section: {
    borderColor: Colors.border,
    borderRadius: 4,
    borderWidth: 1,
    margin: 16,
    padding: 8,
  },
});
