import createReducer from "../createReducer";
import * as constants from "../../actions/LoginAction/constants";

const intialState = {
  isLoading: false,
  clientPortalResData: null,
  loginResData: null,
  forgotPassResData: null,
  loginError: null,
  error: null,
  otpErrorData: null,
  otpResData: null,
  msgError: null,
};
export const loginReducer = createReducer(intialState, {
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
  [constants.GET_CLIENTPORTAL](state, action) {
    return Object.assign({}, state, {
      clientPortalResData: action.response,
      isLoading: false,
    });
  },
  [constants.GET_LOGIN](state, action) {
    return Object.assign({}, state, {
      loginResData: action.response,
      isLoading: false,
    });
  },
  [constants.GET_FORGOT](state, action) {
    return Object.assign({}, state, {
      forgotPassResData: action.response,
      isLoading: false,
    });
  },
  [constants.GET_VERIFY](state, action) {
    return Object.assign({}, state, {
      otpResData: action.response,
      otpErrorData: action.response.errors,
      isLoading: false,
    });
  },
});
