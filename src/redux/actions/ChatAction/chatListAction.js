//This is the class for the actions creators and action dispatchers
import { WebService, ApiUtils } from "../../../utils";
import * as constants from "./constants";

const TAG = "CHAT LIST Action";

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

//Get message list data
export function actionGetChatList(response) {
  return {
    type: constants.GET_CUSTOMER_LIST,
    response,
  };
}

//send user messages data
export function actionSendMessages(response) {
  return {
    type: constants.SEND_CUSTOMER_MESSAGES,
    response,
  };
}

//Get user previous message list data
export function actionLoadpreviousMessages(response) {
  return {
    type: constants.LOAD_CUSTOMER_PREVIOUS_MESSAGES,
    response,
  };
}

//Get country list data
export function actionCountMessagesList(response) {
  return {
    type: constants.GET_CUSTOMER_COUNT_LIST,
    response,
  };
}

//this will dispatch the action accroding to the need
export function getUserChatList(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(
      WebService.GETCHATLIST + '?' + 'search_filter' + '=' + formData
    )
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetChatList(response));
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
export function getUserChatCountList(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.GETCHATCOUNTLIST, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionCountMessagesList(response));
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
export function sendUserMessages(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.SENDMESSAGE, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionSendMessages(response));
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
export function loadUsersPreviousMessages(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.LOADPREVIOUSMESSAGE, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionLoadpreviousMessages(response));
      })
      .catch((e) => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}
