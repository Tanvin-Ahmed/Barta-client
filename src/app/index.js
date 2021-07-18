import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import messageReducer from "./reducers/messageReduce";
import privateVideoCall from "./reducers/privateVideoCallReducer";

export default combineReducers({
  userReducer,
  messageReducer,
  privateVideoCall,
});
