import { Slot } from "expo-router";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { StatusBar } from "expo-status-bar";

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
        <StatusBar animated={true} style="auto" />
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootLayoutNav;
