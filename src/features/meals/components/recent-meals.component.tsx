import { globalStyles } from "@/shared/styles/global";
import { FC } from "react";
import { Text, View } from "react-native";
import { Meal } from "../types/meal.types";
import { MealItem } from "./meal-item.component";

type RecentMealsProps = {
  meals: Meal[];
  onDelete?: () => void;
};

export const RecentMeals: FC<RecentMealsProps> = ({ meals, onDelete }) => {
  return (
    <View style={{ marginTop: 30 }}>
      <Text style={globalStyles.sectionTitle}>Recent Meals</Text>
      {meals.length === 0 ? (
        <Text style={globalStyles.empty}>No meals logged yet.</Text>
      ) : (
        meals
          .slice(0, 5)
          .map((meal) => (
            <MealItem
              id={meal.id}
              key={meal.id}
              name={meal.name}
              calories={meal.calories}
              protein={meal.protein}
              carbs={meal.carbs}
              fat={meal.fat}
              onDelete={onDelete}
            />
          ))
      )}
    </View>
  );
};
