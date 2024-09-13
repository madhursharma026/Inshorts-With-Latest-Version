import { LogLevel, OneSignal } from "react-native-onesignal";
import Constants from "expo-constants";

// Function to initialize OneSignal
export function setupOneSignal() {
  // Set log level to verbose for debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // Initialize OneSignal with your app ID
  OneSignal.initialize(Constants.expoConfig.extra.oneSignalAppId);

  // Request permission for push notifications
  OneSignal.Notifications.requestPermission(true);
}
