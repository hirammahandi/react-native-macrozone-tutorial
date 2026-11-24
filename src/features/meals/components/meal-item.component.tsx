import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { colors } from "@/shared/styles/global";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text } from "react-native";
import { deleteMeal } from "../storage/meals.storage";
type MealItemProps = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  onDelete?: () => void;
};

export const MealItem = ({ id, name, calories, protein, carbs, fat, onDelete }: MealItemProps) => {
  const handleDelete = async () => {
    await deleteMeal(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onDelete?.();
  };

  return (
    <Dialog>
      <DialogTrigger action="longPress">
        <Pressable style={({ pressed }) => [styles.container, { opacity: pressed ? 0.8 : 1 }]}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.macros}>
            {calories} cal • {protein}g P • {carbs}g C • {fat}g F
          </Text>
        </Pressable>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete meal</DialogTitle>
          <DialogDescription>Are you sure you want to delete &quot;{name}&quot;?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Pressable style={[styles.button, styles.buttonClose]}>
              <Text style={[styles.textStyle, styles.textClose]}>Cancel</Text>
            </Pressable>
          </DialogClose>
          <DialogClose>
            <Pressable style={[styles.button, styles.buttonDelete]} onPress={handleDelete}>
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  macros: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    maxWidth: 100,
    width: "100%",
  },
  buttonClose: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  buttonDelete: {
    backgroundColor: colors.alert,
  },
  textStyle: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  textClose: {
    color: colors.text,
  },
});
