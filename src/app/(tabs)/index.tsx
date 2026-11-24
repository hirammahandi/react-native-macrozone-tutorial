import HomeHeader from "@/features/home/components/home-header.component";
import { MacroGrid } from "@/features/macros/components/macro-grid.component";
import { RecentMeals } from "@/features/meals/components/recent-meals.component";
import { useLoadMeals } from "@/features/meals/hooks/use-load-meals";
import { ScreensRoutes } from "@/shared/routes/screens.routes";
import { globalStyles } from "@/shared/styles/global";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { Directions, GestureDetector, useFlingGesture } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const {
    states: { meals },
    actions: { handleLoadMeals },
  } = useLoadMeals({ loadMealsOnFocus: true });

  const flingToNext = useFlingGesture({
    direction: Directions.LEFT,
    runOnJS: true,
    onFinalize: (event) => {
      if (event.canceled) {
        return;
      }

      router.navigate(ScreensRoutes.AddMeals);
    },
  });

  return (
    <GestureDetector gesture={flingToNext}>
      <SafeAreaView style={globalStyles.container}>
        <ScrollView>
          <HomeHeader />
          {/* @note Link component is used to navigate to the screen passed in the href prop.
          <Link href={ScreensRoutes.Meals} style={{ fontSize: 18, color: colors.link }}>
          Go to Meals
          </Link>
        */}
          <MacroGrid meals={meals} />
          <RecentMeals meals={meals} onDelete={handleLoadMeals} />
        </ScrollView>
      </SafeAreaView>
    </GestureDetector>
  );
};

export default HomeScreen;
