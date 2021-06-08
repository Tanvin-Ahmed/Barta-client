import { combineReducers } from "redux";
import userReducer from "./reducers/userReducer";
import messageReducer from "./reducers/messageReduce";

export default combineReducers({
  userReducer,
  messageReducer,
});
