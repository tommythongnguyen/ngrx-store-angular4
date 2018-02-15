import { UserProfile } from '../../services/user-profile.interface';
import * as auth from '../actions/auth.actions';
export interface State {
    loggedIn: boolean;
    userProfile: UserProfile | null;
}
export const initialState: State = {
    loggedIn: false,
    userProfile: null
};

export function reducer(state = initialState, action: auth.AuthActions) {
    switch (action.type) {
        case auth.LOGIN_SUCCESS: {
            return { ...state, loggedIn: true, userProfile: action.payload};
        }
        case auth.LOG_OUT: {
            return initialState;
        }
        case auth.GET_USER_PROFILE_SUCCESS: {
            return { ...state, userProfile: action.payload };
        }
        default: {
            return state;
        }
    }
}

export const getUserProfile = (state: State) => state.userProfile;
export const getLoggedIn = (state: State) => state.loggedIn;
