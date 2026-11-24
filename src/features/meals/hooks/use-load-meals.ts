import { getMeals } from "@/features/meals/storage/meals.storage";
import { Meal } from "@/features/meals/types/meal.types";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

type UseLoadMealsParams = {
  loadMealsOnFocus?: boolean;
};

export const useLoadMeals = ({ loadMealsOnFocus = true }: UseLoadMealsParams) => {
  const [meals, setMeals] = useState<Meal[]>([]);

  const handleLoadMeals = async () => {
    const data = await getMeals();
    setMeals(data);
  };

  useFocusEffect(
    useCallback(() => {
      if (loadMealsOnFocus) {
        handleLoadMeals();
      }
    }, [loadMealsOnFocus]),
  );

  return { states: { meals }, actions: { handleLoadMeals } };
};
