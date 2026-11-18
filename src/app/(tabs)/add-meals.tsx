import { AddMealForm } from "@/components/add-meal-form.component";
import { globalStyles } from "@/styles/global";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddMealScreen() {
  return (
    <SafeAreaView style={globalStyles.container}>
      <AddMealForm />
    </SafeAreaView>
  );
}
