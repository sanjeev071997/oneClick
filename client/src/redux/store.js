import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { composeWithDevTools } from '@redux-devtools/extension'
import { userReducer, profileReducer, forgotPasswordReducer } from "../redux/reducers/userReducers";

const reducer = combineReducers({
    user:userReducer,  
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer, 
});

let initialState = {}

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store;