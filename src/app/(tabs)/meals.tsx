import { SwipeScreenGesture } from "@/components/swipe-screen-gesture";
import { ClearAllMealsDialog } from "@/features/meals/components/clear-all-meals-dialog";
import { MealItem } from "@/features/meals/components/meal-item.component";
import { useLoadMeals } from "@/features/meals/hooks/use-load-meals";
import { clearAllMeals } from "@/features/meals/storage/meals.storage";
import { ScreensRoutes } from "@/shared/routes/screens.routes";
import { colors, globalStyles } from "@/shared/styles/global";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const MealsScreen = () => {
  const {
    states: { meals },
    actions: { handleLoadMeals: loadMeals },
  } = useLoadMeals({ loadMealsOnFocus: true });

  const handleClearAll = async () => {
    await clearAllMeals();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    loadMeals();
  };

  return (
    <SwipeScreenGesture rightScreen={ScreensRoutes.AddMeals}>
      <ScrollView style={globalStyles.container}>
        <View style={globalStyles.header}>
          <Text style={globalStyles.title}>All Meals</Text>
          <ClearAllMealsDialog onDeleteAll={handleClearAll} />
        </View>
        <View style={{ marginTop: 30 }}>
          {meals.length === 0 ? (
            <View style={{ gap: 10 }}>
              <Text style={globalStyles.empty}>No meals logged yet.</Text>
              <Link href={ScreensRoutes.AddMeals} asChild>
                <Pressable style={styles.addButton}>
                  <Ionicons name="add-circle" size={20} color={colors.link} />
                  <Text style={styles.addButtonText}>Add Meal</Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            meals.map((meal) => (
              <MealItem
                key={meal.id}
                id={meal.id}
                name={meal.name}
                calories={meal.calories}
                protein={meal.protein}
                carbs={meal.carbs}
                fat={meal.fat}
                onDelete={loadMeals}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SwipeScreenGesture>
  );
};

export default MealsScreen;

const styles = StyleSheet.create({
  addButtonText: {
    fontSize: 18,
    color: colors.link,
  },
  addButton: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.link,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
});
