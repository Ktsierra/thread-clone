import { Colors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Image,
  type ImageSourcePropType,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";

const Page = () => {
  const { url, threadId } = useLocalSearchParams<{
    url: string;
    threadId: string;
  }>();
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <ImageZoom
          uri={url}
          style={styles.image}
          minScale={0.5}
          maxScale={5}
          isDoubleTapEnabled
          isSingleTapEnabled
          doubleTapScale={2}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    flex: 1,
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
