import { StyleSheet } from "react-native";

export const colors = {
  background: "#1a1a2e",
  header: "#242444",
  surface: "#2a2a4a",
  primary: "#4fc3f7",
  text: "#ffffff",
  textSecondary: "#a0a0b0",
  alert: "#ff5252",
  white: "#ffffff",
  link: "#007bff",
  cardBackground: "#16213e",
  cardText: "#a0a0b0",
  destructive: "#ff5252",
};

/**
 * Spacing scale based on multiples of 4.
 *
 * Values are density-independent units (`dp` on Android, `pt` on iOS, `px` on web),
 * so `spacing.lg` renders at the same visual size on every screen density.
 *
 * @example
 * padding: spacing.lg, // 16
 * gap: spacing.sm, // 8
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: 30,
    marginBottom: 16,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
