import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Vibration,
  RefreshControl,
} from "react-native";
import { Appbar, Text, useTheme, IconButton } from "react-native-paper";
import { useEffect, useState } from "react";
import Task from "./components/Task";
import { useTasks } from "./TaskContext";
import {
  requestPermission,
  createChannel,
  startLiveNotification,
  stopLiveNotification,
} from "./lib/notification";

const Notifications = ({ navigation }) => {
  const theme = useTheme();
  const { taskItems, fetchTodos, notificationTask, setNotificationTask } =
    useTasks();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    requestPermission();
    createChannel();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchTodos();
    setRefreshing(false);
  };

  const setNotification = async (name, createdAt) => {
    setNotificationTask(name);
    const date = new Date(createdAt);
    await startLiveNotification(name, date.toLocaleString("de-DE"));
  };

  const disableNotifications = async () => {
    stopLiveNotification();
    setNotificationTask("");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Notifications" />
      </Appbar.Header>
      <View style={styles.header}>
        <Text
          variant="headlineLarge"
          style={[styles.headline, { color: theme.colors.onBackground }]}
          onPress={() => {
            fetchTodos();
            Vibration.vibrate(10);
          }}
        >
          {notificationTask == "" ? <>No Task set</> : <>{notificationTask}</>}
        </Text>
        <TouchableOpacity
          onPress={() => {
            stopLiveNotification();
            Vibration.vibrate(10);
          }}
        >
          <IconButton
            icon="bell-off"
            onPress={() => disableNotifications()}
          ></IconButton>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.taskWrapper}
        alwaysBounceVertical={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text
          variant="titleMedium"
          style={[
            styles.taskWrapperLabel,
            { color: theme.colors.onBackground },
          ]}
        >
          Awailable Tasks
        </Text>
        <View style={styles.tasks}>
          {taskItems.map((todo) => {
            if (todo.isCompleted) return null;
            return (
              <TouchableOpacity
                key={todo.id}
                onPress={() => {
                  setNotification(todo.name, todo.created_at);
                }}
              >
                <Task name={todo.name} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headline: {
    fontWeight: "bold",
    width: "70%",
  },
  taskWrapper: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 50,
  },
  tasks: {
    paddingTop: 5,
  },
});
