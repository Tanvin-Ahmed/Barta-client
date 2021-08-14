import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import messageReducer from "./reducers/messageReduce";
import privateCall from "./reducers/privateCallReducer";

export default combineReducers({
  userReducer,
  messageReducer,
  privateCall,
});
