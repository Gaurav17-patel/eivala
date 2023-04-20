//This is the class for the actions creators and action dispatchers
import { WebService, ApiUtils } from "../../../utils";
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

//Get my professional action get data
export function actionGetProfessionaTransaction(response) {
  return {
    type: constants.PROFESSIONAL_TRANSACTION,
    response,
  };
}

//Get TRANSCTION VALUE action get data
export function actionGetNewTransaction(response) {
  return {
    type: constants.NEW_TRANSACTION,
    response,
  };
}

//Get my professional action get data
export function actionGetRiskAssesment(response) {
  return {
    type: constants.GET_RISK_ASSESMENT,
    response,
  };
}

//Get TRANSACTION value action get data
export function actionGetTransactionValue(response) {
  return {
    type: constants.GET_TRANSACTION_VALUE,
    response,
  };
}

//this will dispatch the action accroding to the need
export function getProfessionaTransaction(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.TRANSACTIONDATA, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetProfessionaTransaction(response));
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
export function getNewTransaction(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.NEWTRANSACTION, formData)
      .then((response) => {
        console.log("response>>", response);
        dispatch(actionEndRequest());
        dispatch(actionGetNewTransaction(response));
      })
      .catch((e) => {
        console.log("error>>", e);
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getTransactionValues(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.GETTRANSACTIONVALUE, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetTransactionValue(response));
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
export function getRiskAssesmentData(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.GETRISKASSESMENT, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetRiskAssesment(response));
      })
      .catch((e) => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}
