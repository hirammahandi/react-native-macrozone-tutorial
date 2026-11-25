import { useLoadMeals } from "@/features/meals/hooks/use-load-meals";
import { colors, globalStyles } from "@/shared/styles/global";
import { StyleSheet, Text, View } from "react-native";
import { ShareButton } from "./share-button.component";

export default function HomeHeader() {
  const {
    states: { meals },
  } = useLoadMeals({ loadMealsOnFocus: false });
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>MacroZone</Text>
        <ShareButton meals={meals} />
      </View>
      <View style={globalStyles.header}>
        <Text style={styles.date}>{currentDate}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 30,
  },
});
