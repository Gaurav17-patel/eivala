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

/* action for set message error */
export function actionSetMessageError(error) {
  return {
    type: constants.MSG_ERROR,
    error,
  };
}

//login action get data
export function actionGetClientPortal(response) {
  return {
    type: constants.GET_CLIENTPORTAL,
    response,
  };
}

//login action get data
export function actionGetLoginData(response) {
  return {
    type: constants.GET_LOGIN,
    response,
  };
}

//forrgot pass action get data
export function actionForgotPassData(response) {
  return {
    type: constants.GET_FORGOT,
    response,
  };
}

//veryfy OTP action get data
export function actionGetVerifyData(response) {
  return {
    type: constants.GET_VERIFY,
    response,
  };
}

//this will dispatch the action accroding to the need
export function clientPortalAuth(formData) {
  console.log("formData::::::", formData);
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.post(WebService.CLIENTPORTAL, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetClientPortal(response));
      })
      .catch((e) => {
        console.log("eeeee::::::", e);

        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function loginReq(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithXdomin(WebService.LOGIN, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetLoginData(response));
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
export function verifyOtp(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithXdomin(WebService.VERIFY_OTP, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetVerifyData(response));
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
export function forgotPassReq(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.FORGOT_PASSWORD, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionForgotPassData(response));
      })
      .catch((e) => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}
