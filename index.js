/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import 'react-native-gesture-handler'
import { name as appName } from "./app.json";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
