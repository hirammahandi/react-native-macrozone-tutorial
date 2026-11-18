/* eslint-disable @typescript-eslint/no-redeclare */
export const ScreensRoutes = {
  Home: "/",
  Meals: "/meals",
  AddMeals: "/add-meals",
} as const;

export type ScreensRoutes = (typeof ScreensRoutes)[keyof typeof ScreensRoutes];
