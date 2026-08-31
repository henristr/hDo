import notifee, { AndroidImportance } from "@notifee/react-native";

const CHANNEL_ID = "live-channel";
const NOTIFICATION_ID = "live-notif-1";

export async function requestPermission() {
  await notifee.requestPermission();
}

export async function createChannel() {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: "Live Updates",
    importance: AndroidImportance.HIGH,
  });
}

export async function startLiveNotification(task, createdAt) {
  await notifee.displayNotification({
    id: NOTIFICATION_ID,
    title: `${task}`,
    body: `Created at: ${createdAt}`,
    android: {
      channelId: CHANNEL_ID,
      ongoing: true,
      asForegroundService: true,
      pressAction: {
        id: "default",
      },
    },
  });
}

export async function stopLiveNotification() {
  await notifee.stopForegroundService();
  await notifee.cancelNotification(NOTIFICATION_ID);
}
