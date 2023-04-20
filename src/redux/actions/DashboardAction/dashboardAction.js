//This is the class for the actions creators and action dispatchers
import { WebService, ApiUtils } from "../../../utils";
import * as constants from "./constants";

const TAG = "Dashboard Action";

//action for start loader
export function actionStartRequest() {
  return {
    type: constants.START_REQUEST,
  };
}
/* action for end loader */
export function actionEndRequest() {
  return {
    type: constants.END_REQUEST,
  };
}

/* action for set error */
export function actionSetError(error) {
  return {
    type: constants.RESP_ERROR,
    error,
  };
}

/* action for set message error */
export function actionSetMessageError(error) {
  return {
    type: constants.MSG_ERROR,
    error,
  };
}

//get the dashboard data
export function actionGetDashboardData(response) {
  return {
    type: constants.GET_DASHBOARD_DATA,
    response,
  };
}

//get the new list data
export function actionGetNewsListData(response) {
  return {
    type: constants.GET_NEWS_LIST_DATA,
    response,
  };
}

//this will dispatch the action accroding to the need
export function DashboardData(yearData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(
      WebService.DASHBOARD + '?filter_statistics_by_year=' + yearData
    )
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetDashboardData(response));
      })
      .catch((e) => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function newsListData(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.ALLNEWS, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetNewsListData(response));
      })
      .catch((e) => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}
