import createReducer from "../createReducer";
import * as constants from "../../actions/DashboardAction/constants";

const intialState = {
  isLoading: false,
  notificationListData: null,
  error: null,
  msgError: null,
  dashboardDataList: null,
  newsDataList: null,
};
export const dashboardReducer = createReducer(intialState, {
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
  [constants.GET_DASHBOARD_DATA](state, action) {
    return Object.assign({}, state, {
      dashboardDataList: action.response,
      isLoading: false,
    });
  },
  [constants.GET_NEWS_LIST_DATA](state, action) {
    return Object.assign({}, state, {
      newsDataList: action.response,
      isLoading: false,
    });
  },
});
