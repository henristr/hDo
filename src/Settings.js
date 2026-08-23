import {
  StyleSheet,
  TouchableOpacity,
  View,
  Vibration,
  Keyboard,
} from "react-native";
import { Appbar, Button, Text, TextInput, useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useTasks } from "./TaskContext";
import { supabase } from "./lib/supabase";

const Settings = ({ navigation }) => {
  const theme = useTheme();
  const { taskItems, setTaskItems } = useTasks();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [logedIn, setLogedIn] = useState(false);
  const [user, setUser] = useState("");

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
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <View
        style={[
          styles.settingWrapper,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Text variant="labelLarge">Account:</Text>
        {logedIn === true ? (
          <Text>
            Logged in as:{" "}
            <Text style={{ color: theme.colors.primary }}>{user?.email}</Text>
          </Text>
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
              <Button onPress={handleSignIn}>Login</Button>
              <Button onPress={handleSignUp}>Sign Up</Button>
            </View>
            {loginMessage === "" ? null : (
              <Text variant="labelMedium">{loginMessage}</Text>
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
        <Text>Delete all tasks</Text>
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
        <Text>Show completed tasks</Text>
      </TouchableOpacity>
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
});
