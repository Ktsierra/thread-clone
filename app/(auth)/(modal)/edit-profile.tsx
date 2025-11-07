import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { type Id } from "@/convex/_generated/dataModel";
import { type ImagePickerAsset } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
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

interface EditProps {
  bio: string;
  websiteUrl: string;
  imageUrl: Id<"_storage">;
}

const Edit = () => {
  const { biostring, linkstring, imageUrl } = useLocalSearchParams<{
    biostring: string;
    linkstring: string;
    userId: Id<"users">;
    imageUrl: Id<"_storage">;
  }>();

  const [bio, setBio] = useState(biostring);
  const [link, setLink] = useState(linkstring);
  const [selectedImage, setSelectedImage] = useState<ImagePickerAsset | null>(
    null,
  );

  const [isModified, setIsModified] = useState(false);
  const updateUser = useMutation(api.user.updateUser);
  const generateUploadUrl = useMutation(api.user.generateUploadUrl);

  const router = useRouter();

  const onDone = async () => {
    if (!isModified) {
      router.dismiss();
      return;
    }

    const toUpdate: Partial<EditProps> = {
      // userId,
      bio,
      websiteUrl: link,
    };
    if (selectedImage) {
      const storageId = await updateProfilePicture();
      toUpdate.imageUrl = storageId;
    }

    await updateUser(toUpdate);
    setIsModified(false);
    router.dismiss();
  };

  const updateProfilePicture = async () => {
    const uploadUrl = await generateUploadUrl();

    if (!selectedImage?.uri) {
      // This should never happen because we check for selectedImage above
      throw new Error("No image selected for upload.", { cause: "NO_IMAGE" });
    }

    const response = await fetch(selectedImage.uri);
    const blob = await response.blob();

    const result = await fetch(uploadUrl, {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": selectedImage.mimeType ?? "image/jpeg",
      },
    });

    const { storageId } = (await result.json()) as {
      storageId: Id<"_storage">;
    };
    return storageId;
  };

  const markChange =
    (setter: (text: string) => void, prevValue: string) => (text: string) => {
      if (text !== prevValue) setIsModified(true);
      setter(text);
    };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setIsModified(true);
      setSelectedImage(result.assets[0]);
    }
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

      <TouchableOpacity onPress={() => void pickImage()}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
      </TouchableOpacity>

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
    fontWeight: "500",
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
