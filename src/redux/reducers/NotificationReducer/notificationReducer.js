import createReducer from "../createReducer";
import * as constants from "../../actions/NotificationAction/constants";

const intialState = {
  isLoading: false,
  notificationListData: null,
  error: null,
  msgError: null,
};
export const notificationReducer = createReducer(intialState, {
  [constants.START_REQUEST](state) {
    return Object.assign({}, state, {
      isLoading: true,
    });
  },
  [constants.END_REQUEST](state, action) {
    return Object.assign({}, state, {
      isLoading: false,
    });
  },
  [constants.RESP_ERROR](state, action) {
    return Object.assign({}, state, {
      error: action.error,
    });
  },
  [constants.MSG_ERROR](state, action) {
    return Object.assign({}, state, {
      msgError: action,
    });
  },
  [constants.GET_NOTIFICATION_LIST](state, action) {
    return Object.assign({}, state, {
      notificationListData: action.response,
      isLoading: false,
    });
  },
});
