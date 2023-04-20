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
export function actionGetTicketList(response) {
  return {
    type: constants.GET_TICKET_LIST,
    response,
  };
}

//Get my professional action get data
export function actionCreateTicket(response) {
  return {
    type: constants.CREATE_NEW_TICKET,
    response,
  };
}

//close my ticket action
export function actionCloseTicket(response) {
  return {
    type: constants.CLOSE_TICKET,
    response,
  };
}

//reopen my ticket action
export function actionReopenTicket(response) {
  return {
    type: constants.REOPEN_TICKET,
    response,
  };
}

//my ticket pagination action
export function actionTicketPagination(response) {
  return {
    type: constants.GET_TICKET_LIST_PAGINATION,
    response,
  };
}

//my ticket COMMENT action
export function actionTicketCommentAdd(response) {
  return {
    type: constants.GET_TICKET_COMMENT,
    response,
  };
}

//my ticket COMMENT action
export function actionGetTicketComment(response) {
  return {
    type: constants.GET_TICKET_COMMENT_LIST,
    response,
  };
}

//this will dispatch the action accroding to the need
export function addCommentInTicket(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.ADDTICKETCOMMENT, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionTicketCommentAdd(response));
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
export function getTicketList(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(
      WebService.TICKETLIST + '?' + 'filter_by_status=' + formData
    )
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetTicketList(response));
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
export function getFilterMyTicketList(filter_type, filter_options) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(
      WebService.TICKETLIST + '?' + filter_type + '=' + filter_options
    )
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetTicketList(response));
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
export function getMyTicketListByPagination(complete_url) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithTokenPaginationList(complete_url)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetTicketList(response));
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
export function getTicketListPagination(id) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithTokenPaginationList(
      WebService.TICKETLIST + '?page=' + id
    )
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionTicketPagination(response));
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
export function createTicket(formData) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.postWithToken(WebService.CREATENEWTICKET, formData)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionCreateTicket(response));
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
export function getCloseTicket(id) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.CLOSETICKET + '/' + id)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionCloseTicket(response));
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
export function getTicketCommentList(id) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.GETICKETCOMMENT + '/' + id)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionGetTicketComment(response));
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
export function getReopenTicket(id) {
  return (dispatch) => {
    dispatch(actionStartRequest());
    return ApiUtils.getWithToken(WebService.REOPENTICKET + '/' + id)
      .then((response) => {
        dispatch(actionEndRequest());
        dispatch(actionReopenTicket(response));
      })
      .catch((e) => {
        dispatch(actionEndRequest());
        dispatch(actionSetError(JSON.stringify(e.errors)));
        dispatch(actionSetMessageError(JSON.stringify(e.message)));
        // FunctionUtils.showToast(JSON.stringify(e.message));
      });
  };
}
