import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import messageReducer from "./reducers/messageReduce";
import privateCall from "./reducers/privateCallReducer";
import groupCallReducer from "./reducers/groupCallReducer.js";
import webcamReducer from "./reducers/webcamReducer";

export default combineReducers({
  userReducer,
  messageReducer,
  privateCall,
  groupCallReducer,
  webcamReducer,
});
