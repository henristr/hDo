import { registerRootComponent } from "expo";
import notifee, { EventType } from "@notifee/react-native";

import App from "./App";

notifee.registerForegroundService((notification) => {
  return new Promise(() => {});
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.PRESS) {
    console.log("Pressed: ", notification);
  }

  if (type === EventType.DISMISSED) {
    console.log("Dismissed: ", notification);
  }
});

registerRootComponent(App);
