import {
  StyleSheet,
  TouchableOpacity,
  View,
  Vibration,
  Keyboard,
  Linking,
  Platform,
} from "react-native";
import {
  Appbar,
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useTasks } from "./TaskContext";
import { supabase } from "./lib/supabase";
import { getLocales } from "expo-localization";

const Settings = ({ navigation }) => {
  const theme = useTheme();
  const { taskItems, setTaskItems, fetchTodos, logedIn, setLogedIn } =
    useTasks();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [user, setUser] = useState("");

  const locale =
    Platform.OS === "web"
      ? (navigator.language ?? "en-US")
      : (getLocales()[0]?.languageTag ?? "en-US");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setLogedIn(false);
      setUser(null);
    } else {
      setLogedIn(true);
      setUser(user);
    }
  };

  const handleDeleteAllTasks = async () => {
    const { data, error } = await supabase.from("Todo").delete().neq("id", 0);

    if (error) {
      console.log("Error while deleting all Todos: ", error);
      Vibration.vibrate([0, 10, 150, 200]);
    } else {
      setTaskItems([]);
      Vibration.vibrate(10);
    }
  };

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setLoginMessage(error.message);
      Vibration.vibrate([0, 10, 150, 200]);
    } else {
      setLoginMessage("Check your email for verification");
      setEmail("");
      setPassword("");
      Vibration.vibrate(10);
      Keyboard.dismiss();
    }
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginMessage(error.message);
      Vibration.vibrate([0, 10, 150, 200]);
    } else {
      setEmail("");
      setPassword("");
      Vibration.vibrate(10);
      Keyboard.dismiss();
      checkUser();
      setLogedIn(true);
    }
  };

  const handleSignOut = async () => {
    const { data, error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    } else {
      fetchTodos();
      getUser();
      setTaskItems([]);
      setLogedIn(false);
    }
  };

  const translate = (dictionary, locale) =>
    dictionary[locale] ?? dictionary["en-US"];

  const loggedInAsLabel = {
    "de-DE": "Angemeldet als:",
    "en-US": "Logged in as:",
    "fr-FR": "Connecté en tant que :",
    "es-ES": "Conectado como:",
    "it-IT": "Accesso effettuato come:",
    "pt-PT": "Sessão iniciada como:",
    "nl-NL": "Ingelogd als:",
    "pl-PL": "Zalogowano jako:",
    "tr-TR": "Şu hesapla giriş yapıldı:",
    "ru-RU": "Вы вошли как:",
    "uk-UA": "Ви увійшли як:",
    "ar-SA": "تم تسجيل الدخول باسم:",
    "zh-CN": "登录身份：",
    "ja-JP": "ログイン中：",
    "ko-KR": "로그인 계정:",
  };

  const signInLabel = {
    "de-DE": "Anmelden",
    "en-US": "Sign In",
    "fr-FR": "Se connecter",
    "es-ES": "Iniciar sesión",
    "it-IT": "Accedi",
    "pt-PT": "Iniciar sessão",
    "nl-NL": "Inloggen",
    "pl-PL": "Zaloguj się",
    "tr-TR": "Giriş yap",
    "ru-RU": "Войти",
    "uk-UA": "Увійти",
    "ar-SA": "تسجيل الدخول",
    "zh-CN": "登录",
    "ja-JP": "ログイン",
    "ko-KR": "로그인",
  };

  const signUpLabel = {
    "de-DE": "Registrieren",
    "en-US": "Sign Up",
    "fr-FR": "S'inscrire",
    "es-ES": "Registrarse",
    "it-IT": "Registrati",
    "pt-PT": "Registar",
    "nl-NL": "Registreren",
    "pl-PL": "Zarejestruj się",
    "tr-TR": "Kayıt ol",
    "ru-RU": "Зарегистрироваться",
    "uk-UA": "Зареєструватися",
    "ar-SA": "إنشاء حساب",
    "zh-CN": "注册",
    "ja-JP": "新規登録",
    "ko-KR": "가입",
  };

  const signOutLabel = {
    "de-DE": "Abmelden",
    "en-US": "Sign Out",
    "fr-FR": "Se déconnecter",
    "es-ES": "Cerrar sesión",
    "it-IT": "Esci",
    "pt-PT": "Terminar sessão",
    "nl-NL": "Uitloggen",
    "pl-PL": "Wyloguj się",
    "tr-TR": "Çıkış yap",
    "ru-RU": "Выйти",
    "uk-UA": "Вийти",
    "ar-SA": "تسجيل الخروج",
    "zh-CN": "退出登录",
    "ja-JP": "ログアウト",
    "ko-KR": "로그아웃",
  };

  const deleteAllTasksLabel = {
    "de-DE": "Alle Aufgaben löschen",
    "en-US": "Delete all tasks",
    "fr-FR": "Supprimer toutes les tâches",
    "es-ES": "Eliminar todas las tareas",
    "it-IT": "Elimina tutte le attività",
    "pt-PT": "Eliminar todas as tarefas",
    "nl-NL": "Alle taken verwijderen",
    "pl-PL": "Usuń wszystkie zadania",
    "tr-TR": "Tüm görevleri sil",
    "ru-RU": "Удалить все задачи",
    "uk-UA": "Видалити всі завдання",
    "ar-SA": "حذف جميع المهام",
    "zh-CN": "删除所有任务",
    "ja-JP": "すべてのタスクを削除",
    "ko-KR": "모든 할 일 삭제",
  };

  const showCompletedTasksLabel = {
    "de-DE": "Erledigte Aufgaben anzeigen",
    "en-US": "Show completed tasks",
    "fr-FR": "Afficher les tâches terminées",
    "es-ES": "Mostrar tareas completadas",
    "it-IT": "Mostra attività completate",
    "pt-PT": "Mostrar tarefas concluídas",
    "nl-NL": "Voltooide taken weergeven",
    "pl-PL": "Pokaż ukończone zadania",
    "tr-TR": "Tamamlanan görevleri göster",
    "ru-RU": "Показать выполненные задачи",
    "uk-UA": "Показати виконані завдання",
    "ar-SA": "عرض المهام المكتملة",
    "zh-CN": "显示已完成的任务",
    "ja-JP": "完了したタスクを表示",
    "ko-KR": "완료된 할 일 보기",
  };

  const settingsLabel = {
    "de-DE": "Einstellungen",
    "en-US": "Settings",
    "fr-FR": "Paramètres",
    "es-ES": "Ajustes",
    "it-IT": "Impostazioni",
    "pt-PT": "Definições",
    "nl-NL": "Instellingen",
    "pl-PL": "Ustawienia",
    "tr-TR": "Ayarlar",
    "ru-RU": "Настройки",
    "uk-UA": "Налаштування",
    "ar-SA": "الإعدادات",
    "zh-CN": "设置",
    "ja-JP": "設定",
    "ko-KR": "설정",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={translate(settingsLabel, locale)} />
      </Appbar.Header>

      <View
        style={[
          styles.settingWrapper,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text variant="labelLarge">Account:</Text>
        {logedIn === true ? (
          <>
            <Text>
              {translate(loggedInAsLabel, locale)}{" "}
              <Text style={{ color: theme.colors.primary }}>{user?.email}</Text>
            </Text>
            <View style={styles.accountButtons}>
              <Button onPress={handleSignOut}>
                {translate(signOutLabel, locale)}
              </Button>
            </View>
          </>
        ) : (
          <>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(t) => setEmail(t)}
              mode="flat"
            ></TextInput>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(t) => setPassword(t)}
              secureTextEntry
              mode="flat"
            ></TextInput>
            <View style={styles.accountButtons}>
              <Button onPress={handleSignIn}>
                {translate(signInLabel, locale)}
              </Button>
              <Button onPress={handleSignUp}>
                {translate(signUpLabel, locale)}
              </Button>
            </View>
            {loginMessage === "" ? null : (
              <HelperText>{loginMessage}</HelperText>
            )}
          </>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.settingWrapper,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
        onPress={() => {
          handleDeleteAllTasks();
          Vibration.vibrate(10);
        }}
      >
        <Text>{translate(deleteAllTasksLabel, locale)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.settingWrapper,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
        onPress={() => {
          navigation.navigate("Completed");
          Vibration.vibrate(10);
        }}
      >
        <Text>{translate(showCompletedTasksLabel, locale)}</Text>
      </TouchableOpacity>

      <View style={styles.about}>
        <Button onPress={() => Linking.openURL("mailto:mail@henristr.de")}>
          <HelperText>mail@henristr.de</HelperText>
        </Button>
        <Text>|</Text>
        <Button onPress={() => Linking.openURL("https://github.com/henristr")}>
          <HelperText>github.com/henristr</HelperText>
        </Button>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingWrapper: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 15,
  },
  accountButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  about: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
