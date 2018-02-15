import * as logoUploadActions from '../actions/logo-upload.action';

export interface State {
    pending: boolean;
    submitted: boolean;
}

export const initialState: State = {
    pending: false,
    submitted: false
};

export function reducer(state = initialState, action: logoUploadActions.Actions) {
    switch (action.type) {
        case logoUploadActions.SHOW_LOADING:
        case logoUploadActions.SUBMIT:
            return { ...state, pending: true };


        case logoUploadActions.SUBMIT_SUCCESS:
            return { submitted: true, pending: false };

        case logoUploadActions.HIDE_LOADING:
        case logoUploadActions.SUBMIT_FAILURE:
            return { ...state, pending: false };

        case logoUploadActions.SET_SUBMITTED:
            return { ...state, submitted: true };

        default:
            return state;
    }
}

export const getSubmitted = (state: State) => state.submitted;
export const getPending = (state: State) => state.pending;
