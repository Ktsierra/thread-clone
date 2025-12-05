import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { useUserProfile } from "./useUserProfile";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: () =>
    Promise.resolve({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
});

export const usePush = () => {
  const { userProfile } = useUserProfile();
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState<
  //   Notifications.Notification | undefined
  // >(undefined);
  const updateUser = useMutation(api.user.updateUser);
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  useEffect(() => {
    if (!Device.isDevice || !userProfile?._id) return;
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          void updateUser({
            pushToken: token,
          });
        }
      })
      .catch((err: unknown) => console.error(err));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("notification:", notification);
        // router.push({
        //   pathname: "/feed/[id]",
        //   params: { id: notification.request.content.data.threadId as string },
        // });
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("response:", response);
        const { threadId } = response.notification.request.content.data;
        router.push({
          pathname: "/feed/[id]",
          params: {
            id: threadId as string,
          },
        });
      });
  });

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== Notifications.PermissionStatus.GRANTED) {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== Notifications.PermissionStatus.GRANTED) {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!",
        );
        return;
      }

      interface easType {
        projectId: string | undefined;
      }

      const projectId =
        (Constants.expoConfig?.extra?.eas as easType).projectId ??
        Constants.easConfig?.projectId;

      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log("pushtoken", pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        handleRegistrationError(message);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications",
      );
    }
  }
};
