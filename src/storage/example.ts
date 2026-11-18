import AsyncStorage from "@react-native-async-storage/async-storage";

// @note AsyncStorage.setItem() is a function to save data
export const saveData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error saving data", e);
  }
};

// @note AsyncStorage.getItem() is a function to retrieve data
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error retrieving data", e);
  }
};
