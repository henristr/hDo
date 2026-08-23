import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./lib/supabase";

const TaskContext = createContext();
const STORAGE_KEY = "taskItems";
const COMPLETED_STORAGE_KEY = "completedTaskItems";

export const TaskProvider = ({ children }) => {
  const [taskItems, setTaskItems] = useState([]);
  const [completedTaskItems, setCompletedTaskItems] = useState([]);
  const [logedIn, setLogedIn] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const {
      data: { user },
      fetchError,
    } = await supabase.auth.getUser();

    if (fetchError || !user) {
      setLogedIn(false);
      setUserId("");
      return;
    }
    setLogedIn(true);
    setUserId(user.id);

    const { data, error } = await supabase
      .from("Todo")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log("Error fetching Todos: ", error);
    } else {
      setTaskItems(data);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        taskItems,
        setTaskItems,
        fetchTodos,
        userId,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
