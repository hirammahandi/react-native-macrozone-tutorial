import * as Device from "expo-device";
import { Platform, StyleSheet, Text, View } from "react-native";

export const DeviceInfoComponent = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to MacroZone!</Text>
      <Text style={styles.platformText}>Running on: {Platform.OS}</Text>
      <Text>Device Model: {Device.modelName}</Text>
      <Text>Device Brand: {Device.brand}</Text>
      <Text>OS Version: {Device.osVersion}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  platformText: {
    color: "blue",
    fontSize: 32,
    marginBottom: 20,
  },
});
