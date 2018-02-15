import * as dnsGatewayActions from '../actions/dns-gateway.action';

export interface State {
    pending: boolean;
    submitted: boolean;
}

export const initialState: State = {
    pending: false,
    submitted: false
};

export function reducer(state = initialState, action: dnsGatewayActions.Actions) {
    switch (action.type) {
        case dnsGatewayActions.SHOW_LOADING:
        case dnsGatewayActions.SUBMIT:
            return { ...state, pending: true };


        case dnsGatewayActions.SUBMIT_SUCCESS:
            return { submitted: true, pending: false };

        case dnsGatewayActions.HIDE_LOADING:
        case dnsGatewayActions.SUBMIT_FAILURE:
            return { ...state, pending: false };

        case dnsGatewayActions.SET_SUBMITTED:
            return { ...state, submitted: true };

        default:
            return state;
    }
}

export const getSubmitted = (state: State) => state.submitted;
export const getPending = (state: State) => state.pending;
