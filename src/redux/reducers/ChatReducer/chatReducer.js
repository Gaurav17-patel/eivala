import createReducer from "../createReducer";
import * as constants from "../../actions/ChatAction/constants";

const intialState = {
  isLoading: false,
  chatListResData: null,
  previousChatResData: null,
  chatCountList: null,
  sendMessageResData: null,
  error: null,
  msgError: null,
};
export const chatReducer = createReducer(intialState, {
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
  [constants.GET_CUSTOMER_LIST](state, action) {
    return Object.assign({}, state, {
      chatListResData: action.response,
      isLoading: false,
    });
  },
  [constants.SEND_CUSTOMER_MESSAGES](state, action) {
    return Object.assign({}, state, {
      sendMessageResData: action.response,
      isLoading: false,
    });
  },
  [constants.LOAD_CUSTOMER_PREVIOUS_MESSAGES](state, action) {
    return Object.assign({}, state, {
      previousChatResData: action.response,
      isLoading: false,
    });
  },
  [constants.GET_CUSTOMER_COUNT_LIST](state, action) {
    return Object.assign({}, state, {
      chatCountList: action.response,
      isLoading: false,
    });
  },
});
