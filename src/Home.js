import { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Vibration,
  RefreshControl,
} from "react-native";
import {
  Text,
  useTheme,
  TextInput,
  Button,
  IconButton,
} from "react-native-paper";
import React from "react";
import Task from "./components/Task";
import { useTasks } from "./TaskContext";
import { supabase } from "./lib/supabase";
import Alert from "./lib/Alert";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = ({ navigation }) => {
  const theme = useTheme();
  const [task, setTask] = useState("");
  const {
    taskItems,
    setTaskItems,
    completedTaskItems,
    setCompletedTaskItems,
    fetchTodos,
    userId,
    logedIn,
  } = useTasks();

  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    setRefreshing(true);
    fetchTodos();
    setRefreshing(false);
  };

  const handleAddTask = async () => {
    if (task && task.length >= 1) {
      const newTodoData = {
        name: task,
        isCompleted: false,
        user_id: userId,
      };

      const { data, error } = await supabase
        .from("Todo")
        .insert([newTodoData])
        .select("*")
        .single();

      if (error) {
        console.log("Error while adding Todo: ", error);
        Vibration.vibrate([0, 10, 150, 200]);
      } else {
        setTaskItems((prev) => [...prev, data]);
        setTask("");
        Vibration.vibrate(10);
      }
    } else {
      Vibration.vibrate([0, 10, 150, 200]);
      Alert.alert("Error:", "You have to type something!");
    }
  };

  const handleCompleteTask = async (id, isCompleted) => {
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
      <View style={styles.header}>
        <Text
          variant="headlineLarge"
          style={[styles.headline, { color: theme.colors.onBackground }]}
          onPress={() => {
            fetchTodos();
            Vibration.vibrate(10);
          }}
        >
          hDo
        </Text>
        <TouchableOpacity
          style={styles.settingsWrapper}
          onPress={() => navigation.navigate("Settings")}
        >
          <IconButton icon="cog"></IconButton>
        </TouchableOpacity>
      </View>
      {logedIn ? (
        <>
          <ScrollView
            style={styles.taskWrapper}
            contentContainerStyle={{ paddingBottom: 125 + insets.bottom }}
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
              Tasks
            </Text>
            <View style={styles.tasks}>
              {taskItems.map((todo) => {
                if (todo.isCompleted) return null;
                return (
                  <TouchableOpacity
                    key={todo.id}
                    onPress={() =>
                      handleCompleteTask(todo.id, todo.isCompleted)
                    }
                  >
                    <Task name={todo.name} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <KeyboardAvoidingView
            behavior="padding"
            style={styles.writeTaskWrapper}
          >
            <View style={styles.inputRow}>
              <TextInput
                mode="outlined"
                style={styles.input}
                placeholder="Write a Task"
                value={task}
                onChangeText={(text) => setTask(text)}
              />
              <IconButton
                icon="plus"
                mode="contained"
                onPress={() => handleAddTask(task)}
              />
            </View>
          </KeyboardAvoidingView>
        </>
      ) : (
        <>
          <View style={styles.signInHelper}>
            <Button onPress={() => navigation.navigate("Settings")}>
              <Text variant="headlineMedium"> You need to be Signed In</Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headline: {
    fontWeight: "bold",
  },
  settingsWrapper: {
    alignItems: "flex-end",
  },
  taskWrapper: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 50,
    flex: 1,
  },
  tasks: {
    paddingTop: 5,
  },
  writeTaskWrapper: {
    width: "100%",
    padding: 20,
    position: "absolute",
    bottom: 20,
  },
  inputRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "space-around",
  },
  input: {
    width: "80%",
    borderRadius: 50,
    justifyContent: "center",
  },
  signInHelper: {
    flex: 1,
    paddingTop: 64,
    alignItems: "center",
  },
});
