import { Button, StyleSheet, Text, View } from "react-native";
import * as Sentry from "@sentry/react-native";

const Feed = () => {
  const testError = () => {
    try {
      throw new Error("Test Error 2");
    } catch (error) {
      const sentryID = Sentry.captureMessage("Test Error Captured");
      console.log("sentryID:", sentryID);

      const userFeedback: Sentry.SendFeedbackParams = {
        // event_id: sentryID,
        name: "John Doe 2",
        email: "john.doe22@example.com",
        message: "This is a test error2",
      };

      Sentry.captureFeedback(userFeedback);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Try!" onPress={testError} />
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({});
