import * as idpProviderActions from '../actions/idp-provider.action';

export interface State {
    pending: boolean;
    submitted: boolean;
}

export const initialState: State = {
    pending: false,
    submitted: false
};

export function reducer(state = initialState, action: idpProviderActions.Actions) {
    switch (action.type) {
        case idpProviderActions.SHOW_LOADING:
        case idpProviderActions.SUBMIT:
            return { ...state, pending: true };


        case idpProviderActions.SUBMIT_SUCCESS:
            return { submitted: true, pending: false };

        case idpProviderActions.HIDE_LOADING:
        case idpProviderActions.SUBMIT_FAILURE:
            return { ...state, pending: false };

        case idpProviderActions.SET_SUBMITTED:
            return { ...state, submitted: true };

        default:
            return state;
    }
}

export const getSubmitted = (state: State) => state.submitted;
export const getPending = (state: State) => state.pending;
