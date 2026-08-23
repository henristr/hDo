import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import React from "react";

const Task = (props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.taskWrapper,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
    >
      <Text>{props.name}</Text>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({
  taskWrapper: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 15,
  },
});
