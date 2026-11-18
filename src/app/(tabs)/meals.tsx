import { ScreensRoutes } from "@/shared/routes/screens.routes";
import { colors, globalStyles } from "@/styles/global";
import { Link } from "expo-router";
import { ScrollView, Text } from "react-native";

export default function MealsScreen() {
  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>All Meals</Text>
      <Link href={ScreensRoutes.AddMeals} style={{ fontSize: 18, color: colors.link }}>
        Add New Meals
      </Link>
    </ScrollView>
  );
}
