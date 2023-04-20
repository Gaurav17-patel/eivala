//This is the class for the actions creators and action dispatchers

import {
  WebService,
  FunctionUtils,
  ApiUtils,
  PrefrenceManager,
} from "../../../utils";
import * as constants from "./constants";

const TAG = "Login Action";

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

/* action for set error */
export function actionSetMessageError(error) {
  return {
    type: constants.MSG_ERROR,
    error,
  };
}

//Get my profile action get data
export function actionGetProfile(response) {
  return {
    type: constants.GET_PROFILE,
    response,
  };
}

//Get my profile action get data
export function actionUpdateProfile(response) {
  return {
    type: constants.UPDATE_PROFILE,
    response,
  };
}

//user logout
export function actionUserLogout(response) {
  return {
    type: constants.USER_LOGOUT,
    response,
  };
}

//change password
export function actionChangePassword(response) {
  return {
    type: constants.POST_CHANGEPASSWORD,
    response,
  };
}

//this will dispatch the action accroding to the need
export function getMyProfile(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.USERPROFILE, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetProfile(response));
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
export function changePassReq(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.CHANGEPASSWORD, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionChangePassword(response));
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
export function updateMyProfile(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.UPDATEPROFILE, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionUpdateProfile(response));
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
export function userLogout(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.LOGOUT, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionUserLogout(response));
      })
      .catch((e) => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}
