import { useState, useEffect } from "react";
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
  Searchbar,
  Modal,
  Portal,
  TouchableRipple,
} from "react-native-paper";
import Task from "./components/Task";
import { useTasks } from "./TaskContext";
import { supabase } from "./lib/supabase";
import Alert from "./lib/Alert";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { requestPermission, createChannel } from "./lib/notification";
import { getLocales } from "expo-localization";

const Home = ({ navigation }) => {
  const theme = useTheme();
  const [task, setTask] = useState("");
  const { taskItems, setTaskItems, fetchTodos, logedIn } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [modalId, setModalId] = useState(0);

  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const locale = getLocales()[0]?.languageTag ?? "en-US";

  const containerStyle = {
    backgroundColor: theme.colors.surface,
    padding: 20,
    margin: 20,
    borderRadius: 12,
  };

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

  const updateTaskName = async (id, name) => {
    const { data, error } = await supabase
      .from("Todo")
      .update({ name: name })
      .eq("id", id);

    if (error) {
      console.log("Error updating Todo: ", error);
      Vibration.vibrate([0, 10, 150, 200]);
    } else {
      Vibration.vibrate(10);
      const updatedTodoList = taskItems.map((todo) =>
        todo.id === id ? { ...todo, name: name } : todo,
      );
      setTaskItems(updatedTodoList);
    }
  };

  const updateTaskContent = async (id, content) => {
    const { data, error } = await supabase
      .from("Todo")
      .update({ content: content })
      .eq("id", id);

    if (error) {
      console.log("Error updating Todo: ", error);
      Vibration.vibrate([0, 10, 150, 200]);
    } else {
      Vibration.vibrate(10);
      const updatedTodoList = taskItems.map((todo) =>
        todo.id === id ? { ...todo, content: content } : todo,
      );
      setTaskItems(updatedTodoList);
    }
  };

  const updateTask = () => {
    updateTaskName(modalId, modalTitle);
    updateTaskContent(modalId, modalContent);
    setModalVisible(false);
    fetchTodos();
  };

  const showModal = (todo) => {
    setModalVisible(true);
    setModalTitle(todo.name);
    setModalContent(todo.content);
    console.log(todo.id);
  };

  useEffect(() => {
    requestPermission();
    createChannel();
  }, []);

  const translate = (dictionary, locale) =>
    dictionary[locale] ?? dictionary["en-US"];

  const taskHeader = {
    "de-DE": "Aufgaben",
    "en-US": "Tasks",
    "fr-FR": "Tâches",
    "es-ES": "Tareas",
    "it-IT": "Attività",
    "pt-PT": "Tarefas",
    "nl-NL": "Taken",
    "pl-PL": "Zadania",
    "tr-TR": "Görevler",
    "ru-RU": "Задачи",
    "uk-UA": "Завдання",
    "ar-SA": "المهام",
    "zh-CN": "任务",
    "ja-JP": "タスク",
    "ko-KR": "작업",
  };

  const signInLabel = {
    "de-DE": "Du musst angemeldet sein",
    "en-US": "You need to be signed in",
    "fr-FR": "Vous devez être connecté",
    "es-ES": "Debes iniciar sesión",
    "it-IT": "Devi aver effettuato l'accesso",
    "pt-PT": "Tens de iniciar sessão",
    "nl-NL": "Je moet ingelogd zijn",
    "pl-PL": "Musisz się zalogować",
    "tr-TR": "Giriş yapmanız gerekiyor",
    "ru-RU": "Необходимо войти в аккаунт",
    "uk-UA": "Потрібно увійти в обліковий запис",
    "ar-SA": "يجب تسجيل الدخول",
    "zh-CN": "你需要登录",
    "ja-JP": "ログインする必要があります",
    "ko-KR": "로그인해야 합니다",
  };

  const writeTaskLabel = {
    "de-DE": "Aufgabe schreiben",
    "en-US": "Write a Task",
    "fr-FR": "Écrire une tâche",
    "es-ES": "Escribir una tarea",
    "it-IT": "Scrivi un'attività",
    "pt-PT": "Escrever uma tarefa",
    "nl-NL": "Een taak schrijven",
    "pl-PL": "Napisz zadanie",
    "tr-TR": "Bir görev yaz",
    "ru-RU": "Напишите задачу",
    "uk-UA": "Напишіть завдання",
    "ar-SA": "اكتب مهمة",
    "zh-CN": "写任务",
    "ja-JP": "タスクを書く",
    "ko-KR": "할 일 작성",
  };

  const searchLabel = {
    "de-DE": "Suchen",
    "en-US": "Search",
    "fr-FR": "Rechercher",
    "es-ES": "Buscar",
    "it-IT": "Cerca",
    "pt-PT": "Pesquisar",
    "nl-NL": "Zoeken",
    "pl-PL": "Szukaj",
    "tr-TR": "Ara",
    "ru-RU": "Поиск",
    "uk-UA": "Пошук",
    "ar-SA": "بحث",
    "zh-CN": "搜索",
    "ja-JP": "検索",
    "ko-KR": "검색",
  };

  const nameLabel = {
    "de-DE": "Name",
    "en-US": "Name",
    "fr-FR": "Nom",
    "es-ES": "Nombre",
    "it-IT": "Nome",
    "pt-PT": "Nome",
    "nl-NL": "Naam",
    "pl-PL": "Nazwa",
    "tr-TR": "Ad",
    "ru-RU": "Имя",
    "uk-UA": "Назва",
    "ar-SA": "الاسم",
    "zh-CN": "名称",
    "ja-JP": "名前",
    "ko-KR": "이름",
  };

  const contentLabel = {
    "de-DE": "Inhalt",
    "en-US": "Content",
    "fr-FR": "Contenu",
    "es-ES": "Contenido",
    "it-IT": "Contenuto",
    "pt-PT": "Conteúdo",
    "nl-NL": "Inhoud",
    "pl-PL": "Treść",
    "tr-TR": "İçerik",
    "ru-RU": "Содержание",
    "uk-UA": "Вміст",
    "ar-SA": "المحتوى",
    "zh-CN": "内容",
    "ja-JP": "内容",
    "ko-KR": "내용",
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
        <View style={styles.settingsWrapper}>
          <IconButton
            icon="bell-badge"
            onPress={() => navigation.navigate("Notifications")}
          />
          <IconButton
            icon="cog"
            onPress={() => navigation.navigate("Settings")}
          ></IconButton>
        </View>
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
              {translate(taskHeader, locale)}
            </Text>
            <View style={styles.tasks}>
              <Searchbar
                style={[
                  styles.searchbar,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
                placeholder={translate(searchLabel, locale)}
                onChangeText={setSearchQuery}
                value={searchQuery}
              />
              <View
                style={[
                  styles.vLine,
                  { backgroundColor: theme.colors.outline },
                ]}
              />
              {taskItems
                .filter((todo) => !todo.isCompleted)
                .filter((todo) =>
                  todo.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((todo) => {
                  if (todo.isCompleted) return null;
                  return (
                    <TouchableOpacity
                      key={todo.id}
                      onPress={() =>
                        handleCompleteTask(todo.id, todo.isCompleted)
                      }
                      onLongPress={() => {
                        showModal(todo);
                        setModalId(todo.id);
                      }}
                    >
                      <Task name={todo.name} />
                    </TouchableOpacity>
                  );
                })}
              <Portal>
                <Modal
                  visible={modalVisible}
                  onDismiss={() => setModalVisible(false)}
                  contentContainerStyle={containerStyle}
                >
                  <Text variant="titleMedium">
                    {translate(nameLabel, locale)}
                  </Text>
                  <View style={styles.modalTitle}>
                    <TextInput
                      value={modalTitle}
                      onChangeText={(text) => setModalTitle(text)}
                    />
                  </View>
                  <View
                    style={[
                      styles.vLine,
                      { backgroundColor: theme.colors.outline },
                    ]}
                  />

                  <View style={styles.modalContent}>
                    <Text variant="titleMedium">
                      {translate(contentLabel, locale)}
                    </Text>
                    <TextInput
                      value={modalContent}
                      onChangeText={(text) => setModalContent(text)}
                    />
                  </View>
                  <View style={styles.modalButtons}>
                    <Button onPress={() => setModalVisible(false)}>
                      Cancel
                    </Button>
                    <Button onPress={updateTask}>Ok</Button>
                  </View>
                </Modal>
              </Portal>
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
                placeholder={translate(writeTaskLabel, locale)}
                value={task}
                onChangeText={(text) => setTask(text)}
                onSubmitEditing={() => handleAddTask(task)}
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
              <Text variant="headlineMedium">
                {translate(signInLabel, locale)}
              </Text>
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
    flexDirection: "row",
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
  searchbar: {
    marginTop: 8,
  },
  vLine: {
    height: 1,
    marginTop: 16,
  },
  modalTitle: {
    paddingBottom: 8,
  },
  modalContent: {
    paddingTop: 16,
  },
  modalButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});
