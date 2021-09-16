import { applyMiddleware, createStore } from "redux";

import { combineReducers } from "redux";
import {touReducer} from "./toureducer";
import {useReducer} from "./userAction"
// const thunkMiddleWare = require("redux-thunk").default
import thunk from "redux-thunk"
let rootReducers = combineReducers({
    tour:touReducer,
    user:useReducer

})

const store  = createStore(rootReducers,applyMiddleware(thunk))

 
export default store 

    