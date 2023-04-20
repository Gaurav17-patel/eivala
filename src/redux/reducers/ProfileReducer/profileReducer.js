import createReducer from "../createReducer";
import * as constants from "../../actions/ProfileAction/constants";

const intialState = {
  isLoading: false,
  myProfileData: null,
  updateProfileData: null,
  changePassResData: null,
  userLogoutData: null,
  error: null,
  msgError: null,
};
export const profileReducer = createReducer(intialState, {
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
    console.log('------RESP_ERROR--', action.response);
    return Object.assign({}, state, {
      error: action.error,
    });
  },
  [constants.MSG_ERROR](state, action) {
    return Object.assign({}, state, {
      msgError: action,
    });
  },
  [constants.GET_PROFILE](state, action) {
    return Object.assign({}, state, {
      myProfileData: action.response,
      isLoading: false,
    });
  },
  [constants.GET_PROFILE](state, action) {
    return Object.assign({}, state, {
      myProfileData: action.response,
      isLoading: false,
    });
  },
  [constants.POST_CHANGEPASSWORD](state, action) {
    console.log('--------', action.response);
    return Object.assign({}, state, {
      changePassResData: action.response,
      isLoading: false,
    });
  },
  [constants.UPDATE_PROFILE](state, action) {
    return Object.assign({}, state, {
      updateProfileData: action.response,
      isLoading: false,
    });
  },
  [constants.USER_LOGOUT](state, action) {
    return Object.assign({}, state, {
      userLogoutData: action.response,
      isLoading: false,
    });
  },
});
