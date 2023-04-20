import Toast from "react-native-simple-toast";
import * as globals from "../utils/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PreferenceKey, PreferenceManager } from "../utils";
import { Actions, ActionConst } from "react-native-router-flux";
import moment from "moment";
import { Alert, BackHandler } from "react-native";
import strings from "../themes/strings";

class FunctionUtils {
  static showToast(toastString) {
    setTimeout(() => Toast.show(toastString, Toast.SHORT), 10);
  }

  static showLongToast(toastString) {
    setTimeout(() => Toast.show(toastString, Toast.LONG), 10);
  }

  static validateEmail = (email) => {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  };

  static validatePasswordLength = (number) => {
    if (number.length >= 8) {
      return true;
    }
    return false;
  };

  static dateSeparate(date) {
    var date = moment(date).format('DD/MM/YYYY');
    return date;
  }

  static chatDateSeparate(date) {
    var date = moment(date);
    return date.format('Do MMMM, YYYY');
  }

  static notificationDateTimeSeparate(date) {
    var date = moment(date);
    return date.format('Do MMMM YYYY, hh:mm a');
  }

  static isSpecialCharOnly(string) {
    return string.match(/^[^a-zA-Z0-9]+$/) ? true : false;
  }

  static chatDateTimeSeparate(date) {
    var date = moment(date);
    return date.format('Do MMMM , hh:mm a');
  }

  static timeSeparate = (time) => {
    // var date = moment(new Date(time));
    // return date.format('hh:mm a');
    var local = moment.utc(time).local().format('hh:mm a');
    return local;
  };

  static pickerArraySelectDataType = (userData) => {
    var cb = [];
    userData.map((item) => {
      if (item.value !== null) {
        cb.push({
          label: item.name,
          value: item.id,
          id: item.id,
        });
      }
    });
    return cb;
  };

  //call when back button press
  static appExitMsg = () => {
    Alert.alert(
      strings.AppName,
      strings.appExitMsg,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Ok', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: true }
    );
    return true;
  };

  static validateUserAgeLength = (DOB) => {
    var setDate1 = new Date(DOB);
    var year = setDate1.getFullYear();
    var month = setDate1.getMonth();
    var day = setDate1.getDate();
    var age = 18;
    var setDate = new Date(year + age, month - 1, day);
    var currdate = new Date();
    if (currdate >= setDate) {
      return true;
    } else {
      return false;
    }
  };

  static GetFilename = (url) => {
    if (url) {
      var m = url.split('/').pop().split('#')[0].split('?')[0];
      return m;
    }
    return "";
  };

  static clearLogin() {
    AsyncStorage.setItem("@isLogin", "false");
    PreferenceManager.clearPreferenceByKey(PreferenceKey.USER_TOKEN);
    Actions.Login();
  }

  static unauthMsgHandling(msgError) {
    let value;
    {
      msgError ? (value = msgError.error.replace(/\"/g, '')) : null;
    }
    return value;
  }

  static validateStrongPassword = (number) => {
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return regularExpression.test(number);
  };

  static validateName = (name) => {
    var reg = /^[a-zA-Z]+$/;
    return reg.test(name);
  };

  static validateNumber = (number) => {
    let reg = /^[0-9]*$/;
    if (reg.test(number) === true) {
      return true;
    }
    return false;
  };

  static async clearData() {
    globals.isLoggedIn = false;
    globals.loginUserData = {};
    await PreferenceManager.clearPreference();
  }

  static isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => layoutMeasurement.height + contentOffset.y >= contentSize.height - 30;
}

export default FunctionUtils;
