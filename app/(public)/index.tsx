import { Colors } from "@/constants/Colors";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  type ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSSO } from "@clerk/clerk-expo";
import { type OAuthStrategy } from "@clerk/types";
import { StatusBar } from "expo-status-bar";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const LoginScreen = () => {
  const { startSSOFlow } = useSSO();
  const data = useQuery(api.user.getAllUsers);
  console.log("data:", data);

  const { isAuthenticated } = useConvexAuth();
  console.log("isAuthenticated:", isAuthenticated);

  const handleSSOLogin = async (strategy: OAuthStrategy) => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
      });
      console.log("createdSessionId:", createdSessionId);
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId }).catch((error: unknown) => {
          console.error(error);
        });
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar animated={true} hidden />
      <Image
        source={require("@/assets/images/login.png") as ImageSourcePropType}
        style={styles.loginImage}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>How would you like to use Threads?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => void handleSSOLogin("oauth_facebook")}
          >
            <View style={styles.loginButtonContent}>
              <Image
                source={
                  require("@/assets/images/instagram_icon.webp") as ImageSourcePropType
                }
                style={styles.loginButtonIcon}
              />
              <Text style={styles.loginButtonText}>
                Continue with Instagram
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={styles.loginButtonSubtitle}>
              You can browse Threads without a profile, but won&apos;t be able
              to post, interact or get personalised recommendations.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => void handleSSOLogin("oauth_google")}
          >
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Continue with Google</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton}>
            <View style={styles.loginButtonContent}>
              <Text style={styles.loginButtonText}>Use without a profile</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.border}
              />
            </View>
            <Text style={styles.loginButtonSubtitle}>
              You can browse Threads without a profile, but won&apos;t be able
              to post, interact or get personalised recommendations.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.switcAccountsButtonText}>Switch Accounts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    gap: 20,
    marginHorizontal: 20,
  },
  container: {
    alignItems: "center",
    backgroundColor: Colors.background,
    flex: 1,
    gap: 20,
  },
  loginButton: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  loginButtonContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  loginButtonIcon: {
    height: 50,
    width: 50,
  },
  loginButtonSubtitle: {
    color: Colors.border,
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    marginTop: 5,
  },
  loginButtonText: {
    flex: 1,
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
  },
  loginImage: {
    height: 350,
    resizeMode: "cover",
    width: "100%",
  },
  switcAccountsButtonText: {
    alignSelf: "center",
    color: Colors.border,
    fontSize: 14,
  },
  title: {
    fontFamily: "DMSans_700Bold",
    fontSize: 17,
  },
});
