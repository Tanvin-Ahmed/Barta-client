import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import messageReducer from "./reducers/messageReduce";
import privateCall from "./reducers/privateCallReducer";
import groupCallReducer from "./reducers/groupCallReducer.js";

export default combineReducers({
  userReducer,
  messageReducer,
  privateCall,
  groupCallReducer,
});
