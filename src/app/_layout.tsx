import { Stack } from "expo-router";
// import { colors } from "@/styles/global";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

// @note this is an example of how to use the Stack component to create a layout for the app
// export default function RootLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         // headerShown: false,

//         // @note headerTitle is for the title of the top screen
//         // headerTitle: "MacroZone",
//         // @note headerTitleStyle is for the style of the title in the header
//         // headerTitleStyle: {
//         //   color: "#1a1a2e",
//         //   fontSize: 20,
//         // },
//         headerStyle: {
//           backgroundColor: colors.header,
//         },
//         // @note headerTintColor is for the color of the text in the header
//         headerTintColor: colors.white,
//       }}
//     >
//       <Stack.Screen
//         // @note the prop `name` must be the same as the name of the screen in the `app` folder
//         name="index"
//         // @note the prop `options` is for the options of the screen
//         options={{ headerShown: false, title: "Home" }}
//       >
//         {/* <Stack.Header
//           // hidden
//           style={{ backgroundColor: colors.header }}
//         />
//         <Stack.Title asChild>
//           <HomeHeader />
//         </Stack.Title> */}
//       </Stack.Screen>
//       <Stack.Screen name="meals" options={{ title: "Meals" }} />
//       <Stack.Screen name="add-meals" options={{ title: "Add Meals" }} />
//     </Stack>
//   );
// }
