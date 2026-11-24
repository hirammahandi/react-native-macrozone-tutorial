import { colors } from "@/shared/styles/global";
import { useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
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

const webBlur = Platform.OS === "web" ? { backdropFilter: "blur(4px)" as const } : null;

export const MealItemOriginal = ({ id, name, calories, protein, carbs, fat, onDelete }: MealItemProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = async () => {
    await deleteMeal(id);
    onDelete?.();
  };

  const handleModalVisible = (open: boolean) => () => {
    /*   Alert.alert("Delete Meal", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteMeal(id);
          onDelete?.();
        },
      },
    ]); */
    setModalVisible(open);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.container, { opacity: pressed ? 0.8 : 1 }]}
        onLongPress={handleModalVisible(true)}
        // onPress={() => setModalVisible(true)}
      >
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.macros}>
          {calories} cal • {protein}g P • {carbs}g C • {fat}g F
        </Text>
      </Pressable>
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={handleModalVisible(!modalVisible)}>
        <Pressable style={[styles.centeredView, webBlur]} onPress={handleModalVisible(false)}>
          <Pressable style={styles.modalView} onPress={() => {}}>
            <Text style={styles.modalText}>Are you sure you want to delete &quot;{name}&quot;?</Text>
            <View style={styles.buttonContainer}>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={[styles.textStyle, styles.textClose]}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonDelete]} onPress={handleDelete}>
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    width: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    // elevation: 2,
    maxWidth: 100,
    width: "100%",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  buttonDelete: {
    backgroundColor: "#FF0000",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textClose: {
    color: "#000",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
