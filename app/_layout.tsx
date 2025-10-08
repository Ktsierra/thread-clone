import { Slot } from "expo-router";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hide();
    }
  }, [fontsLoaded]);

  return <Slot />;
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <StatusBar animated={true} style="auto" />
          <InitialLayout />
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootLayoutNav;
