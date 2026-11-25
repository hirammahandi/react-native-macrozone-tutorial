import { SwipeScreenGesture } from "@/components/swipe-screen-gesture";
import { CopyButton } from "@/features/home/components/copy-button.comnponent";
import HomeHeader from "@/features/home/components/home-header.component";
import { MacroGrid } from "@/features/macros/components/macro-grid.component";
import { RecentMeals } from "@/features/meals/components/recent-meals.component";
import { useLoadMeals } from "@/features/meals/hooks/use-load-meals";
import { ReminderToggler } from "@/features/notifications/components/reminder-toggler.component";
import { ScreensRoutes } from "@/shared/routes/screens.routes";
import { globalStyles } from "@/shared/styles/global";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const {
    states: { meals },
    actions: { handleLoadMeals },
  } = useLoadMeals({ loadMealsOnFocus: true });

  return (
    <SwipeScreenGesture rightScreen={ScreensRoutes.AddMeals}>
      <SafeAreaView style={globalStyles.container}>
        <ScrollView>
          <HomeHeader />
          {/* @note Link component is used to navigate to the screen passed in the href prop.
          <Link href={ScreensRoutes.Meals} style={{ fontSize: 18, color: colors.link }}>
          Go to Meals
          </Link>
        */}
          <MacroGrid meals={meals} />
          <CopyButton meals={meals} />
          <ReminderToggler />
          <RecentMeals meals={meals} onDelete={handleLoadMeals} />
        </ScrollView>
      </SafeAreaView>
    </SwipeScreenGesture>
  );
};

export default HomeScreen;
