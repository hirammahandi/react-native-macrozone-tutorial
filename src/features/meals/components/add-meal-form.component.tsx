import { colors, globalStyles, spacing } from "@/shared/styles/global";
import { useReducer, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { toast } from "sonner-native";

const initialState = {
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};

type MealFormState = typeof initialState;

type MealReducerAction =
  | {
      type: "SET_NAME" | "SET_CALORIES" | "SET_PROTEIN" | "SET_CARBS" | "SET_FAT";
      payload: string;
    }
  | { type: "RESET" };

type MealFieldAction = Exclude<MealReducerAction["type"], "RESET">;

const mealReducer = (state: MealFormState, action: MealReducerAction): MealFormState => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_CALORIES":
      return { ...state, calories: action.payload };
    case "SET_PROTEIN":
      return { ...state, protein: action.payload };
    case "SET_CARBS":
      return { ...state, carbs: action.payload };
    case "SET_FAT":
      return { ...state, fat: action.payload };
    case "RESET":
      return initialState;
    default: {
      const unhandledAction: never = action;
      return unhandledAction;
    }
  }
};

// Some locales type decimals with a comma on the numeric keyboard.
const toNumber = (value: string) => Number(value.trim().replace(",", "."));

const isValidMacro = (value: string) => {
  if (value.trim() === "") return true;
  const parsed = toNumber(value);
  return Number.isFinite(parsed) && parsed >= 0;
};

const validateMeal = ({ name, calories, protein, carbs, fat }: MealFormState) => {
  if (name.trim() === "") return "Meal name is required";

  const parsedCalories = toNumber(calories);
  if (calories.trim() === "" || !Number.isFinite(parsedCalories) || parsedCalories <= 0) {
    return "Calories must be a number greater than 0";
  }

  if (![protein, carbs, fat].every(isValidMacro)) {
    return "Protein, carbs and fat must be numbers of 0 or more";
  }

  return null;
};

export const AddMealForm = () => {
  const [state, dispatch] = useReducer(mealReducer, initialState);
  const [error, setError] = useState<string | null>(null);

  const { name, calories, protein, carbs, fat } = state;

  const handleReducer = (type: MealFieldAction) => (value: string) => {
    setError(null);
    dispatch({ type, payload: value });
  };

  const handleAddMeal = () => {
    const validationError = validateMeal(state);
    if (validationError) {
      setError(validationError);
      return;
    }

    const meal = {
      name: name.trim(),
      calories: toNumber(calories),
      protein: toNumber(protein || "0"),
      carbs: toNumber(carbs || "0"),
      fat: toNumber(fat || "0"),
    };

    console.log(meal);
    toast.success("Meal added", { description: `${meal.name} · ${meal.calories} kcal` });

    // @note Keyboard.dismiss() is used to dismiss (hide) the keyboard when the user presses the add meal button. It's a native method that is available in React Native.
    Keyboard.dismiss();
    dispatch({ type: "RESET" });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={globalStyles.title}>Add Meal</Text>
        <TextInput
          style={styles.input}
          placeholder="Meal name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={handleReducer("SET_NAME")}
        />

        <TextInput
          style={styles.input}
          placeholder="Calories"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={calories}
          onChangeText={handleReducer("SET_CALORIES")}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.rowInput]}
            placeholder="Protein (g)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={protein}
            onChangeText={handleReducer("SET_PROTEIN")}
          />
          <TextInput
            style={[styles.input, styles.rowInput]}
            placeholder="Carbs (g)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={carbs}
            onChangeText={handleReducer("SET_CARBS")}
          />
          <TextInput
            style={[styles.input, styles.rowInput]}
            placeholder="Fat (g)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={fat}
            onChangeText={handleReducer("SET_FAT")}
          />
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={handleAddMeal}>
          <Text style={styles.buttonText}>Add Meal</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xl,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowInput: {
    flex: 1,
  },
  error: {
    color: colors.alert,
    fontSize: 14,
    marginTop: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});
