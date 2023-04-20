import createReducer from "../createReducer";
import * as constants from "../../actions/CustomerAction/constants";

const intialState = {
  isLoading: false,
  customerListData: null,
  customerFolderListData: null,
  countryList: null,
  stateList: null,
  atecoCodeList: null,
  customerDetail: null,
  customerFolderExpandDetail: null,
  UpdateCustomerResponce: null,
  manuallyAddCustomer: null,
  addNewCustomer: null,
  getLegalNatureData: null,
  customerFolderDetailsExpandData: null,
  mandatoryDocUpload: null,
  otherDocUpload: null,
  error: null,
  msgError: null,
  getCustomerQuestionList: null,
};
export const customerReducer = createReducer(intialState, {
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
      customerListData: action.response,
      isLoading: false,
    });
  },
  [constants.GET_COUNTRY_LIST](state, action) {
    return Object.assign({}, state, {
      countryList: action.response,
      isLoading: false,
    });
  },
  [constants.GET_STATE_LIST](state, action) {
    return Object.assign({}, state, {
      stateList: action.response,
      isLoading: false,
    });
  },
  [constants.GET_ATECO_CODE_LIST](state, action) {
    return Object.assign({}, state, {
      atecoCodeList: action.response,
      isLoading: false,
    });
  },
  [constants.GET_CUSTOMER_DETAILS](state, action) {
    return Object.assign({}, state, {
      customerDetail: action.response,
      isLoading: false,
    });
  },
  [constants.UPDATE_CUSTOMER_DATA](state, action) {
    return Object.assign({}, state, {
      UpdateCustomerResponce: action.response,
      isLoading: false,
    });
  },
  [constants.MANUALLY_ADD_CUSTOMER](state, action) {
    return Object.assign({}, state, {
      manuallyAddCustomer: action.response,
      isLoading: false,
    });
  },
  [constants.ADD_NEW_CUSTOMER](state, action) {
    return Object.assign({}, state, {
      addNewCustomer: action.response,
      isLoading: false,
    });
  },
  [constants.CUSTOMER_FOLDER_LIST](state, action) {
    return Object.assign({}, state, {
      customerFolderListData: action.response,
      isLoading: false,
    });
  },
  [constants.CUSTOMER_FOLDER_EXPAND](state, action) {
    return Object.assign({}, state, {
      customerFolderExpandDetail: action.response,
      isLoading: false,
    });
  },
  [constants.GET_LEGAL_NATURE](state, action) {
    return Object.assign({}, state, {
      getLegalNatureData: action.response,
      isLoading: false,
    });
  },
  [constants.CUSTOMER_FOLDER_DETAILS](state, action) {
    return Object.assign({}, state, {
      customerFolderDetailsExpandData: action.response,
      isLoading: false,
    });
  },
  [constants.MANDATORY_DOC_UPLOAD](state, action) {
    return Object.assign({}, state, {
      mandatoryDocUpload: action.response,
      isLoading: false,
    });
  },
  [constants.OTHER_DOC_UPLOAD](state, action) {
    return Object.assign({}, state, {
      otherDocUpload: action.response,
      isLoading: false,
    });
  },
  [constants.CUSTOMER_QUESTION_LIST](state, action) {
    return Object.assign({}, state, {
      getCustomerQuestionList: action.response,
      isLoading: false,
    });
  },
});
