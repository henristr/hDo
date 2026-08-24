import { Alert as RNAlert, Platform } from "react-native";

const Alert = {
  alert: (title, message, buttons) => {
    if (Platform.OS === "web") {
      if (buttons && buttons.length > 1) {
        const confirmed = window.confirm(`${title}\n${message}`);
        if (confirmed) {
          buttons.find((b) => b.style !== "cancel")?.onPress?.();
        } else {
          buttons.find((b) => b.style === "cancel")?.onPress?.();
        }
      } else {
        window.alert(`${title}\n${message}`);
        buttons?.[0]?.onPress?.();
      }
    } else {
      Alert.alert(title, message, buttons);
    }
  },
};

export default Alert;
