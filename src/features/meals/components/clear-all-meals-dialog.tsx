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
import { Pressable, StyleSheet, Text } from "react-native";

type ClearAllMealsDialogProps = {
  onDeleteAll?: () => void;
};

export const ClearAllMealsDialog = ({ onDeleteAll }: ClearAllMealsDialogProps) => {
  const handleDeleteAll = () => {
    onDeleteAll?.();
  };

  return (
    <Dialog>
      <DialogTrigger action="press">
        <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
          <Text style={styles.name}>Clear All Meals</Text>
        </Pressable>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear All Meals</DialogTitle>
          <DialogDescription>Are you sure you want to clear all meals?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Pressable style={[styles.button, styles.buttonClose]}>
              <Text style={[styles.textStyle, styles.textClose]}>Cancel</Text>
            </Pressable>
          </DialogClose>
          <DialogClose>
            <Pressable style={[styles.button, styles.buttonDelete]} onPress={handleDeleteAll}>
              <Text style={styles.textStyle}>Clear All</Text>
            </Pressable>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.destructive,
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
