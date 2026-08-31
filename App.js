import { StatusBar } from "expo-status-bar";
import { AppRegistry, useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  useTheme,
} from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { name as appName } from "./app.json";
import Home from "./src/Home";
import Settings from "./src/Settings";
import { TaskProvider } from "./src/TaskContext";
import Completed from "./src/Completed";
import { useState } from "react";
import Notifications from "./src/Notifications";

const Stack = createNativeStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <TaskProvider>
        <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Completed" component={Completed} />
            <Stack.Screen name="Notifications" component={Notifications} />
          </Stack.Navigator>
        </NavigationContainer>
      </TaskProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
