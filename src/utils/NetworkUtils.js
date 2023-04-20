import NetInfo from "@react-native-community/netinfo";

export default class NetworkUtils {
  static async isNetworkAvailable() {
    const response = await NetInfo.fetch();
    console.log("response ====", response);
    return response.isConnected || response.isInternetReachable;
  }
}
