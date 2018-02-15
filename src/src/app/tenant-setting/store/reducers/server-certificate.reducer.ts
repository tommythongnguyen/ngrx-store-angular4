import * as serverCertActions from '../actions/server-cert.action';

export interface State {
    submitted: boolean;
    pending: boolean;
}
export const initialState: State = {
    submitted: false,
    pending: false
};

export function reducer(state = initialState, action: serverCertActions.Actions) {
    switch (action.type) {
        case serverCertActions.SHOW_LOADING:
        case serverCertActions.SUBMIT:
            return { ...state, pending: true };


        case serverCertActions.SUBMIT_SUCCESS:
            return { submitted: true, pending: false };

        case serverCertActions.HIDE_LOADING:
        case serverCertActions.SUBMIT_FAILURE:
            return { ...state, pending: false };

        case serverCertActions.SET_SUBMITTED:
            return { ...state, submitted: true };

        default:
            return state;
    }
}

export const getSubmitted = (state: State) => state.submitted;
export const getPending = (state: State) => state.pending;

