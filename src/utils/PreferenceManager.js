import AsyncStorage from "@react-native-async-storage/async-storage";

class PreferenceManager {
  static async setPreferenceValue(key, value) {
    await AsyncStorage.setItem(key, value);
  }

  static async getPreferenceValue(key) {
    return await AsyncStorage.getItem(key);
  }

  static async clearPreference() {
    await AsyncStorage.clear();
  }
  static async clearPreferenceByKey(key) {
    await AsyncStorage.removeItem(key);
  }
}

export default PreferenceManager;
