//This is the class for the actions creators and action dispatchers

import {
  WebService,
  FunctionUtils,
  ApiUtils,
  PrefrenceManager,
} from '../../../utils';
import * as constants from './constants';

const TAG = 'CUSTOMER Action';

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

//Get customer list data
export function actionGetCustomerList(response) {
  return {
    type: constants.GET_CUSTOMER_LIST,
    response,
  };
}

//Get country list data
export function actionGetCountryList(response) {
  return {
    type: constants.GET_COUNTRY_LIST,
    response,
  };
}

//Get state list data
export function actionGetStateList(response) {
  return {
    type: constants.GET_STATE_LIST,
    response,
  };
}

//Get ateco code list data
export function actionGetAtecoCodeList(response) {
  return {
    type: constants.GET_ATECO_CODE_LIST,
    response,
  };
}

//Get edit customer details data
export function actionCustomerDetail(response) {
  return {
    type: constants.GET_CUSTOMER_DETAILS,
    response,
  };
}

//Get select customer list data
export function actionUpdateCustomerAPI(response) {
  return {
    type: constants.UPDATE_CUSTOMER_DATA,
    response,
  };
}

//Get select customer list data
export function actionManuallyAddCustomerAPI(response) {
  return {
    type: constants.MANUALLY_ADD_CUSTOMER,
    response,
  };
}

//Add new customer
export function actionAddNewCustomerAPI(response) {
  return {
    type: constants.ADD_NEW_CUSTOMER,
    response,
  };
}

//Add CUSTOMER FOLDER LIST
export function actionCustomerFolderListAPI(response) {
  return {
    type: constants.CUSTOMER_FOLDER_LIST,
    response,
  };
}

//Add CUSTOMER FOLDER LIST
export function actionCustomerFolderExpandAPI(response) {
  return {
    type: constants.CUSTOMER_FOLDER_EXPAND,
    response,
  };
}

//Get legal nature list
export function actionGetLegalNatureAPI(response) {
  return {
    type: constants.GET_LEGAL_NATURE,
    response,
  };
}

//customer folder detail getting
export function actionCustomerFolderDetailsAPI(response) {
  return {
    type: constants.CUSTOMER_FOLDER_DETAILS,
    response,
  };
}

//customer folder detail getting
export function actionMandatoryDocUploadAPI(response) {
  return {
    type: constants.MANDATORY_DOC_UPLOAD,
    response,
  };
}

//customer folder detail getting
export function actionOtherDocUploadAPI(response) {
  return {
    type: constants.OTHER_DOC_UPLOAD,
    response,
  };
}

//customer QUESTION LIST detail getting
export function actionCustomerQuestionListAPI(response) {
  return {
    type: constants.CUSTOMER_QUESTION_LIST,
    response,
  };
}

//this will dispatch the action accroding to the need
export function mandatoryDocUploadAP(formData) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.MANDATORYDOCUPLOAD, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionMandatoryDocUploadAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function otherDocUploadAP(formData) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.OTHERDOCUPLOAD, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionOtherDocUploadAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getLegalNatureList(formData) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.LEGALNATURE, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionGetLegalNatureAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getMyCustomerList(formData) {
  console.log({formData});
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.CUSTOMERLIST, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionGetCustomerList(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getFilterMyCustomerList(filter_type, filter_options) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(
      WebService.CUSTOMERLIST + '?' + filter_type + '=' + filter_options,
    )
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionGetCustomerList(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getCountryList(formData) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.COUNTRYLIST, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionGetCountryList(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getUserStateList(formData, id) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.STATELIST + '/' + id, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionGetStateList(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getAtecoCodeList(formData) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.GETATECOLIST, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionGetAtecoCodeList(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getCustomerDetails(formData, id) {
  console.log("getCustomerDetails", formData);
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(
      WebService.GETCUSTOMERDETAILS + '/' + id,
      formData,
    )
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionCustomerDetail(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function updateCustomerAPI(formData) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.UPDATECUSTOMERAPI, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionUpdateCustomerAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function manuallyAddCustomerAPI(formData) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.MANUALLYADDCUSTOMER, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionManuallyAddCustomerAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function addNewCustomerAPI(formData) {
  return dispatch => {
    // console.log('formData::::', formData);
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.CREATENEWCUSTOMER, formData)
      .then(response => {
        console.log("apiresponse>>>", response);
        dispatch(actionEndRequest());
        dispatch(actionAddNewCustomerAPI(response));
      })
      .catch(e => {
        console.log('e::::', e);
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
  // return (dispatch) => {
  //   dispatch(actionStartRequest());
  //   return ApiUtils.postImageWithToken(WebService.CREATENEWCUSTOMER, formData)
  //     .then((response) => {
  //       dispatch(actionEndRequest());
  //       dispatch(actionAddNewCustomerAPI(response));
  //     })
  //     .catch((e) => {
  //       dispatch(actionEndRequest());
  //       dispatch(actionSetError(JSON.stringify(e.errors)));
  //       dispatch(actionSetMessageError(JSON.stringify(e.message)));
  //       // FunctionUtils.showToast(JSON.stringify(e.message));
  //     });
  // };
}

//this will dispatch the action accroding to the need
export function addCustomerFolderListAPI(formData) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.CUSTOMERFOLDERLIST, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionCustomerFolderListAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getListByPagination(complete_url) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithTokenPaginationList(complete_url)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionCustomerFolderListAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getCustomerListByPagination(complete_url) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithTokenPaginationList(complete_url)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionGetCustomerList(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getFilterMyCustomerFolder(filter_type, filter_options) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(
      WebService.CUSTOMERFOLDERLIST + '?' + filter_type + '=' + filter_options,
    )
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionCustomerFolderListAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function customerFolderExpand(formData, id) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(
      WebService.CUSTOMERFOLDEREXPAND + '/' + id,
      formData,
    )
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionCustomerFolderExpandAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function customerFolderDetailsExpand(formData, id) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.GETCUSTDETAILS + '/' + id, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionCustomerFolderDetailsAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}

//this will dispatch the action accroding to the need
export function getCustomerQuestion(formData) {
  return dispatch => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.GETCUSTOMERQUESTIONLIST, formData)
      .then(response => {
        dispatch(actionEndRequest());
        dispatch(actionCustomerQuestionListAPI(response));
      })
      .catch(e => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}
