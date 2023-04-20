//This is the class for the actions creators and action dispatchers

import {
  WebService,
  FunctionUtils,
  ApiUtils,
  PrefrenceManager,
} from "../../../utils";
import * as constants from "./constants";

const TAG = "Transaction Action";

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

//create new ticket action get data
export function actionGetNotificationList(response) {
  return {
    type: constants.GET_NOTIFICATION_LIST,
    response,
  };
}

//this will dispatch the action accroding to the need
export function getNotificationList(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.GETNOTIFICATIONS, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetNotificationList(response));
      })
      .catch((e) => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
      });
  };
}

//this will dispatch the action accroding to the need
export function getNotificationListByPagination(complete_url) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithTokenPaginationList(complete_url)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetNotificationList(response));
      })
      .catch((e) => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}
