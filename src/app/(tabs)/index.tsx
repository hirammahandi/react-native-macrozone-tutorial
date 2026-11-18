import HomeHeader from "@/features/home/components/home-header.component";
import { MacroGrid } from "@/features/macros/components/macro-grid.component";
import { RecentMeals } from "@/features/meals/components/recent-meals.component";
import { globalStyles } from "@/shared/styles/global";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <HomeHeader />
        {/* <Link href={ScreensRoutes.Meals} style={{ fontSize: 18, color: colors.link }}>
        Go to Meals
        </Link> */}
        <MacroGrid />
        <RecentMeals />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
