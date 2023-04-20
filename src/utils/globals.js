import React from "react";
import { Dimensions, Platform, View, StatusBar } from "react-native";
import config from "./config";

export const AUTH_PARAMS = `?consumer_key=${config.WC_CONSUMER_KEY}&consumer_secret=${config.WC_CONSUMER_SECRET}&`;

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

export const iPhoneX =
  Platform.OS === "ios" &&
  Dimensions.get("window").height === 812 &&
  Dimensions.get("window").width === 375;

export const isInternetConnected = false;

export const isLoggedIn = false;
export const loginUserData = {};
export var tokenValue = "";

// More big new
export const font_8 = screenWidth * 0.0225; // 8
export const font_9 = screenWidth * 0.025; // 9
export const font_10 = screenWidth * 0.0275; // 10
export const font_11 = screenWidth * 0.03; // 11
export const font_12 = screenWidth * 0.032; // 12
export const font_13 = screenWidth * 0.0346; // 13
export const font_14 = screenWidth * 0.0375; // 14
// export const font_14 = Platform.OS === 'ios' ? screenHeight * 0.02 : screenHeight * 0.0172; // 14
export const font_15 = screenWidth * 0.04; // 14
export const font_16 = screenWidth * 0.0425; // 16
// export const font_16 = Platform.OS === 'ios' ? screenHeight * 0.02 : screenHeight * 0.02; // 16
export const font_17 = screenWidth * 0.045; // 17
export const font_18 = screenWidth * 0.0475; // 18
export const font_19 = screenWidth * 0.0475; // 19
export const font_20 = screenWidth * 0.053; // 20
export const font_22 = screenWidth * 0.055; // 22
export const font_24 = screenWidth * 0.064; // 24
export const font_26 = screenWidth * 0.0693; // 26
export const font_28 = screenWidth * 0.07; // 28
export const font_29 = screenWidth * 0.075; // 28
export const font_32 = screenWidth * 0.08; // 32
export const font_36 = screenWidth * 0.09; // 36
export const font_40 = screenWidth * 0.106; // 40
export const font_53 = 53; // 53
