import { createStore, combineReducers, applyMiddleware } from "redux";
/// ***********************************
// upgrade this createStore to RTK's configureStore later ***********
import thunk from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";
import { productReducer } from "./reducers/productReducer"

const reducer = combineReducers({
  products: productReducer,
});

let initialState = {};

const middlewre = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middlewre))
);

export default store;