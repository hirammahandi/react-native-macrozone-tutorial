import { colors, spacing } from "@/styles/global";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type MacroCardProps = {
  label: string;
  value: string;
  goal: string;
  color: string;
};

export const MacroCard: FC<MacroCardProps> = ({ label, value, goal, color }) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.goal}>/ {goal}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.md,
    padding: spacing.lg,
    width: "47%",
    borderLeftWidth: spacing.xs,
  },
  label: {
    fontSize: 14,
    color: colors.cardText,
  },
  value: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.white,
    marginTop: spacing.xs,
  },
  goal: {
    fontSize: 14,
    color: colors.cardText,
    marginTop: spacing.sm,
  },
});
