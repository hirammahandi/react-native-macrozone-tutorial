import * as Notifications from "expo-notifications";
import { AndroidImportance } from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    try {
      await Notifications.setNotificationChannelAsync("meal-reminders", {
        name: "Meal reminders",
        importance: AndroidImportance.HIGH,
      });
    } catch (error) {
      // Expo Go 58.0.5 on Android rejects every channel call (expo/expo#53907); fall back to the default channel.
      console.warn("Could not create the meal-reminders channel", error);
    }
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};
export const scheduleMealReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "MacroZone",
      body: "Don't forget to log your lunch!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 12,
      minute: 0,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "MacroZone",
      body: "Time to log your dinner!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
    },
  });
};

export const cancelMealReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
