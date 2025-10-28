import { Slot, useRouter, useSegments } from "expo-router";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import * as SplashScreen from "expo-splash-screen";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useEffect } from "react";
import {
  ClerkProvider,
  ClerkLoaded,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

  attachScreenshot: true,
  debug: false,
  tracesSampleRate: 1,
  profilesSampleRate: 1,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL ?? "", {
  unsavedChangesWarning: false,
});

SplashScreen.preventAutoHideAsync().catch((error: unknown) => {
  console.warn("SplashScreen.preventAutoHideAsync() error: ", error);
});

const InitialLayout = () => {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hide();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(auth)";

    if (!isSignedIn && inTabsGroup) router.replace("/(public)");
    if (isSignedIn && !inTabsGroup) router.replace("/(auth)/(tabs)/profile");
  }, [isSignedIn, segments, isLoaded, router]);

  useEffect(() => {
    if (user) {
      Sentry.setUser({
        email: user.emailAddresses[0].emailAddress,
        id: user.id,
        username: user.username ?? undefined,
      });
    }
  }, [user]);

  return <Slot />;
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <StatusBar animated={true} style="auto" />
          <InitialLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default Sentry.wrap(RootLayoutNav);
