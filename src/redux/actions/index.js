import * as loginAction from "./LoginAction/loginAction";
import * as profileAction from "./ProfileAction/profileAction";
import * as customerAction from "./CustomerAction/customerAction";
import * as transactionAction from "./TransactionAction/transactionAction";
import * as ticketAction from "./TicketAction/ticketAction";
import * as notificationAction from "./NotificationAction/notificationAction";
import * as dashboardAction from "./DashboardAction/dashboardAction";
import * as chatListAction from "./ChatAction/chatListAction";

export const ActionCreators = Object.assign(
  {},
  loginAction,
  profileAction,
  customerAction,
  transactionAction,
  ticketAction,
  notificationAction,
  dashboardAction,
  chatListAction
);
