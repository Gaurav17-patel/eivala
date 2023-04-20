import createReducer from "../createReducer";
import * as constants from "../../actions/TransactionAction/constants";

const intialState = {
  isLoading: false,
  professionalPerformanceData: null,
  newTransactionResponse: null,
  transactionValueResponse: null,
  getRiskAssesment: null,
  error: null,
  msgError: null,
};
export const transcationReducer = createReducer(intialState, {
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
  [constants.PROFESSIONAL_TRANSACTION](state, action) {
    return Object.assign({}, state, {
      professionalPerformanceData: action.response,
      isLoading: false,
    });
  },
  [constants.NEW_TRANSACTION](state, action) {
    return Object.assign({}, state, {
      newTransactionResponse: action.response,
      isLoading: false,
    });
  },
  [constants.GET_RISK_ASSESMENT](state, action) {
    return Object.assign({}, state, {
      getRiskAssesment: action.response,
      isLoading: false,
    });
  },
  [constants.GET_TRANSACTION_VALUE](state, action) {
    return Object.assign({}, state, {
      transactionValueResponse: action.response,
      isLoading: false,
    });
  },
});
