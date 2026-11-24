import { AddMealForm } from "@/features/meals/components/add-meal-form.component";
import { ScreensRoutes } from "@/shared/routes/screens.routes";
import { globalStyles } from "@/shared/styles/global";
import { router } from "expo-router";
import { Directions, GestureDetector, useExclusiveGestures, useFlingGesture } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddMealScreen() {
  const flingLeft = useFlingGesture({
    direction: Directions.LEFT,
    runOnJS: true,
    onFinalize: (event) => {
      if (event.canceled) {
        return;
      }
      router.navigate(ScreensRoutes.Meals);
    },
  });

  const flingRight = useFlingGesture({
    direction: Directions.RIGHT,
    runOnJS: true,
    onFinalize: (event) => {
      if (event.canceled) {
        return;
      }
      router.navigate(ScreensRoutes.Home);
    },
  });

  const fling = useExclusiveGestures(flingLeft, flingRight);

  /*   const swipe = usePanGesture({
    runOnJS: true,
    activeOffsetX: [-24, 24],
    failOffsetY: [-16, 16],
    onDeactivate: (event) => {
      if (event.canceled) {
        return;
      }

      console.log({ velocityX: event.velocityX });
      if (event.velocityX < 0) {
        router.navigate(ScreensRoutes.Meals);
      } else {
        router.navigate(ScreensRoutes.Home);
      }
    },
  }); */

  return (
    <GestureDetector gesture={fling}>
      <SafeAreaView style={globalStyles.container}>
        <AddMealForm />
      </SafeAreaView>
    </GestureDetector>
  );
}
