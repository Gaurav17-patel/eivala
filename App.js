import React, { Component } from "react";
import { View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Router from "./src/container/router/index";
import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import appReducer from "./src/redux/reducers/index";
import * as globals from "./src/utils/globals";
import {
  FunctionUtils,
  NetworkUtils,
  PreferenceManager,
  PreferenceKey,
} from "./src/utils";

//Bellow shows you logs in console in  the development mode
const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__,
});
//bellow is the code for redux configurations
function configureStore(initialState) {
  const enhancer = compose(applyMiddleware(thunkMiddleware, loggerMiddleware));
  return createStore(appReducer, initialState, enhancer);
}
const store = configureStore({}); //passing the store of the redux using provider to entire app

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkLoginVal: false,
    };
  }

  componentDidMount() {
    NetInfo.addEventListener((state) => {
      globals.isInternetConnected = state.isConnected;
    });
    this.checkUserLoginStatus();
  }

  async checkUserLoginStatus() {
    var user_token = await PreferenceManager.getPreferenceValue(
      PreferenceKey.USER_TOKEN
    );
    console.log("token====>", user_token);
    if (user_token == null || user_token == "" || user_token == undefined) {
      globals.isLoggedIn = false;
      this.setState({ checkLoginVal: true });
    } else {
      globals.isLoggedIn = true;
      globals.tokenValue = user_token;
      this.setState({ checkLoginVal: true });
    }
  }

  componentWillUnmount() {
    NetInfo.addEventListener((state) => {
      globals.isInternetConnected = state.isConnected;
    });
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          {this.state.checkLoginVal ? <Router /> : null}
        </View>
      </Provider>
    );
  }
}
