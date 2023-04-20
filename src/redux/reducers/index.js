//Class responsible for combining all the reducers
import { combineReducers } from "redux";
import * as loginReducer from "./LoginReducer/loginReducer";
import * as profileReducer from "./ProfileReducer/profileReducer";
import * as customerReducer from "./CustomerReducer/customerReducer";
import * as transactionReducer from "./TransactionReducer/transactionReducer";
import * as ticketReduers from "./TicketReducers/ticketReduers";
import * as notificationReducer from "./NotificationReducer/notificationReducer";
import * as dashboardReducer from "./DashboardReducer/dashboardReducer";
import * as chatReducer from "./ChatReducer/chatReducer";

const appReducer = combineReducers(
  Object.assign(
    {},
    loginReducer,
    profileReducer,
    customerReducer,
    transactionReducer,
    ticketReduers,
    notificationReducer,
    dashboardReducer,
    chatReducer
  )
);

export default appReducer;
