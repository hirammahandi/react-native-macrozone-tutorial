import { colors, globalStyles } from "@/styles/global";
import { useReducer } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const initialState = {
  name: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};

type MealReducerAction = {
  type: "SET_NAME" | "SET_CALORIES" | "SET_PROTEIN" | "SET_CARBS" | "SET_FAT" | "RESET";
  payload: string;
};

const mealReducer = (state: typeof initialState, action: MealReducerAction) => {
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
    default:
      return state;
  }
};
export const AddMealForm = () => {
  const [state, dispatch] = useReducer(mealReducer, initialState);

  const { name, calories, protein, carbs, fat } = state;

  const handleReducer = (type: MealReducerAction["type"]) => (value: string) => {
    dispatch({ type, payload: value });
  };

  const handleAddMeal = () => {
    console.log(state);
  };

  return (
    <View>
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

      <TouchableOpacity style={styles.button} onPress={handleAddMeal}>
        <Text style={styles.buttonText}>Add Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});
