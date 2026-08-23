import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Vibration,
  RefreshControl,
} from "react-native";
import { Appbar, Text, useTheme, IconButton } from "react-native-paper";
import React, { useState } from "react";
import Task from "./components/Task";
import { useTasks } from "./TaskContext";
import { supabase } from "./lib/supabase";

const Completed = ({ navigation }) => {
  const theme = useTheme();
  const { taskItems, setTaskItems, fetchTodos } = useTasks();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchTodos();
    setRefreshing(false);
  };

  const handleDeleteAllTasks = async () => {
    const { data, error } = await supabase
      .from("Todo")
      .delete()
      .eq("isCompleted", true);

    if (error) {
      console.log("Error deleting Todos: ", error);
      Vibration.vibrate([0, 10, 150, 200]);
    } else {
      Vibration.vibrate(10);
      setTaskItems((prev) => prev.filter((todo) => todo.isCompleted !== true));
    }
  };

  const handleUncompleteTask = async (id, isCompleted) => {
    const { data, error } = await supabase
      .from("Todo")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.log("Error updating Todo: ", error);
      Vibration.vibrate([0, 10, 150, 200]);
    } else {
      Vibration.vibrate(10);
      const updatedTodoList = taskItems.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo,
      );
      setTaskItems(updatedTodoList);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Completed" />
      </Appbar.Header>
      <View style={styles.header}>
        <Text
          variant="headlineLarge"
          style={[styles.headline, { color: theme.colors.onBackground }]}
        >
          hDo
        </Text>
        <TouchableOpacity
          onPress={() => {
            handleDeleteAllTasks();
            Vibration.vibrate(10);
          }}
        >
          <IconButton icon="trash-can"></IconButton>
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
          Completed tasks
        </Text>
        <View style={styles.tasks}>
          {taskItems.map((todo) => {
            if (todo.isCompleted)
              return (
                <TouchableOpacity
                  key={todo.id}
                  onPress={() =>
                    handleUncompleteTask(todo.id, todo.isCompleted)
                  }
                >
                  <Task name={todo.name} />
                </TouchableOpacity>
              );
            return null;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Completed;

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
