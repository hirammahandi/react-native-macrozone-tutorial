import { Meal } from "@/features/meals/types/meal.types";
import { colors } from "@/shared/styles/global";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { FC } from "react";
import { Share, TouchableOpacity } from "react-native";

type ShareButtonProps = {
  meals: Meal[];
};

export const ShareButton: FC<ShareButtonProps> = ({ meals }) => {
  const handleShare = async () => {
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    await Share.share({
      message: `MacroZone Daily Summary\n\nCalories: ${totals.calories}\nProtein: ${totals.protein}g\nCarbs: ${totals.carbs}g\nFat: ${totals.fat}g\n\nMeals: ${meals.length} logged today`,
    });
  };

  return (
    <TouchableOpacity onPress={handleShare}>
      <Ionicons name="share-outline" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};
