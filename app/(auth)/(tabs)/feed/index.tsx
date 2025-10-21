import { Button, StyleSheet, Text, View } from "react-native";
import * as Sentry from "@sentry/react-native";

const Feed = () => {
  return (
    <View>
      <Text>FEEd</Text>
      <Text>FEEd</Text>
      <Text>FEEd</Text>
      <Text>FEEd</Text>
      <Text>FEEd</Text>
      <Button
        title="Try!"
        onPress={() => {
          Sentry.captureException(new Error("First error"));
        }}
      />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({});
