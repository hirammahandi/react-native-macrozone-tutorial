import { Href, router } from "expo-router";
import { FC, PropsWithChildren } from "react";
import { Directions, GestureDetector, useExclusiveGestures, useFlingGesture } from "react-native-gesture-handler";

type SwipeScreenGestureProps = PropsWithChildren<
  | {
      leftScreen: Href;
      rightScreen?: Href;
    }
  | {
      leftScreen?: Href;
      rightScreen: Href;
    }
>;

export const SwipeScreenGesture: FC<SwipeScreenGestureProps> = ({ children, leftScreen, rightScreen }) => {
  const flingLeft = useFlingGesture({
    direction: Directions.LEFT,
    runOnJS: true,
    onFinalize: (event) => {
      if (event.canceled) {
        return;
      }
      if (leftScreen) {
        router.navigate(leftScreen);
      }
    },
  });

  const flingRight = useFlingGesture({
    direction: Directions.RIGHT,
    runOnJS: true,
    onFinalize: (event) => {
      if (event.canceled) {
        return;
      }
      if (rightScreen) {
        router.navigate(rightScreen);
      }
    },
  });

  const gestures = [rightScreen ? flingRight : undefined, leftScreen ? flingLeft : undefined].filter(Boolean) as any;

  const fling = useExclusiveGestures(...gestures);

  return <GestureDetector gesture={fling}>{children}</GestureDetector>;
};
