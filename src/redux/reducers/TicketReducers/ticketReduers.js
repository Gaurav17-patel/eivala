import createReducer from "../createReducer";
import * as constants from "../../actions/TicketAction/constants";

const intialState = {
  isLoading: false,
  ticketListData: null,
  ticketListPaginationData: null,
  createTicketData: null,
  error: null,
  msgError: null,
  closeTicket: null,
  reopenTicket: null,
  ticketCommentList: null,
  getTicketComment: null,
};
export const ticketReducer = createReducer(intialState, {
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
  [constants.GET_TICKET_LIST](state, action) {
    return Object.assign({}, state, {
      ticketListData: action.response,
      isLoading: false,
    });
  },
  [constants.CREATE_NEW_TICKET](state, action) {
    return Object.assign({}, state, {
      createTicketData: action.response,
      isLoading: false,
    });
  },
  [constants.GET_TICKET_LIST_PAGINATION](state, action) {
    return Object.assign({}, state, {
      ticketListPaginationData: action.response,
      isLoading: false,
    });
  },
  [constants.CLOSE_TICKET](state, action) {
    return Object.assign({}, state, {
      closeTicket: action.response,
      isLoading: false,
    });
  },
  [constants.REOPEN_TICKET](state, action) {
    return Object.assign({}, state, {
      reopenTicket: action.response,
      isLoading: false,
    });
  },
  [constants.GET_TICKET_COMMENT](state, action) {
    return Object.assign({}, state, {
      ticketCommentList: action.response,
      isLoading: false,
    });
  },
  [constants.GET_TICKET_COMMENT_LIST](state, action) {
    return Object.assign({}, state, {
      getTicketComment: action.response,
      isLoading: false,
    });
  },
});
