import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
} from "./reducers/productReducers";

import { basketReducer } from "./reducers/basketReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  allUsersReducer,
  deleteUserReducer,
  updateUserReducer,
} from "./reducers/userReducers";
import {
  allOrderReducer,
  orderCreateReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderPayReducer,
  userOrderReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  basket: basketReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  allUsers: allUsersReducer,
  deleteUser: deleteUserReducer,
  updateUser: updateUserReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  userOrders: userOrderReducer,
  allOrders: allOrderReducer,
});

// Get user info from LS - checks if present, if not just return null
const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// Get basket from LS  - checks if present, if not just returns an empty array
const basketItemsFromLocalStorage = localStorage.getItem("basketItems")
  ? JSON.parse(localStorage.getItem("basketItems"))
  : [];

// Add basket & user info to initial state
const initialState = {
  basket: {
    basketItems: basketItemsFromLocalStorage,
  },
  userLogin: { userInfo: userInfoFromLocalStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
