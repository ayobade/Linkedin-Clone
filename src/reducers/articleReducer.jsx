import { SET_LOADING_STATUS, SET_POSTS } from "../actions/actionType";


export const initState = {
    loading: false,
    posts: [],
};


const articleReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_LOADING_STATUS:
            return {
                ...state,
                loading: action.status,
            };
        case SET_POSTS:
            return {
                ...state,
                posts: action.posts || [],
            };
        default:
            return state;
    }
};


export default articleReducer;