import { colors } from "@/shared/styles/global";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { cancelMealReminders, requestPermissions, scheduleMealReminders } from "../utils";

const REMINDERS_KEY = "remindersEnabled";

export const ReminderToggler = () => {
  const [enabled, setEnabled] = useState(false);
  const { getItem } = useAsyncStorage(REMINDERS_KEY);

  useEffect(() => {
    const load = async () => {
      const val = await getItem();
      setEnabled(val === "true");
    };
    load();
  }, []);

  const toggle = async (value: boolean) => {
    if (value) {
      const granted = await requestPermissions();
      if (!granted) return;
      await scheduleMealReminders();
    } else {
      await cancelMealReminders();
    }
    setEnabled(value);
    await AsyncStorage.setItem(REMINDERS_KEY, value.toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meal Reminders</Text>
      <Switch value={enabled} onValueChange={toggle} trackColor={{ false: colors.surface, true: colors.primary }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  label: {
    color: colors.text,
    fontSize: 16,
  },
});
