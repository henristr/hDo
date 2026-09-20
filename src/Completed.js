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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getLocales } from "expo-localization";

const Completed = ({ navigation }) => {
  const theme = useTheme();
  const { taskItems, setTaskItems, fetchTodos } = useTasks();

  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const locale = getLocales()[0]?.languageTag ?? "en-US";

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

  const translate = (dictionary, locale) =>
    dictionary[locale] ?? dictionary["en-US"];

  const completedLabel = {
    "de-DE": "Erledigt",
    "en-US": "Completed",
    "fr-FR": "Terminé",
    "es-ES": "Completado",
    "it-IT": "Completato",
    "pt-PT": "Concluído",
    "nl-NL": "Voltooid",
    "pl-PL": "Ukończone",
    "tr-TR": "Tamamlandı",
    "ru-RU": "Выполнено",
    "uk-UA": "Виконано",
    "ar-SA": "مكتمل",
    "zh-CN": "已完成",
    "ja-JP": "完了",
    "ko-KR": "완료",
  };

  const completedTasksLabel = {
    "de-DE": "Erledigte Aufgaben",
    "en-US": "Completed Tasks",
    "fr-FR": "Tâches terminées",
    "es-ES": "Tareas completadas",
    "it-IT": "Attività completate",
    "pt-PT": "Tarefas concluídas",
    "nl-NL": "Voltooide taken",
    "pl-PL": "Ukończone zadania",
    "tr-TR": "Tamamlanan görevler",
    "ru-RU": "Выполненные задачи",
    "uk-UA": "Виконані завдання",
    "ar-SA": "المهام المكتملة",
    "zh-CN": "已完成的任务",
    "ja-JP": "完了したタスク",
    "ko-KR": "완료된 할 일",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={translate(completedLabel, locale)} />
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
          {translate(completedTasksLabel, locale)}
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
    flex: 1,
  },
  tasks: {
    paddingTop: 5,
  },
});
