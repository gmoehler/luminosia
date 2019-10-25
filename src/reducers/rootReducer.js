import { combineReducers } from "redux";

import viewReducer from "./viewReducer";
import entityReducer from "./entityReducer";

export default combineReducers({
    view: viewReducer,
    entities: entityReducer,
});
