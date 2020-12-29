import axios from "axios";
import { useSelector } from "react-redux";
import {
  BASKET_ADD_ITEM,
  BASKET_REMOVE_ITEM,
  BASKET_SAVE_PAYMENT_METHOD,
  BASKET_SAVE_SHIPPING_ADDRESS,
  GET_USER_BASKET_REQUEST,
  GET_USER_BASKET_SUCCESS,
  GET_USER_BASKET_FAIL,
} from "../types/basketTypes";

// // GET USER BASKET FROM DB
// export const getUserBasket = () => async (dispatch, getState) => {
//   try {
//     console.log("action");

//     dispatch({
//       type: GET_USER_BASKET_REQUEST,
//     });

//     const config = {
//       headers: {
//         // Get token from userInfo state
//         Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
//       },
//     };

//     // Get data from API
//     const { data } = await axios.get("/api/baskets", config);

//     // Then send data to reducer
//     dispatch({
//       type: GET_USER_BASKET_SUCCESS,
//       payload: data,
//     });

//     //
//   } catch (error) {
//     dispatch({
//       type: GET_USER_BASKET_FAIL,
//       // If specific error returned, dispatch it, otherwise dispatch generic error
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

export const addToBasket = (id, quantity) => async (dispatch, getState) => {
  // Get details of product being added to basket
  const { data } = await axios.get(`/api/products/${id}`);

  dispatch({
    type: BASKET_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      quantity,
    },
  });

  // Save basket from state to local storage - need to convert to string
  localStorage.setItem(
    "basketItems",
    JSON.stringify(getState().basket.basketItems)
  );
};

export const removeFromBasket = (id) => async (dispatch, getState) => {
  // Pass ID of product to remove - will then remove from state in reducer
  dispatch({
    type: BASKET_REMOVE_ITEM,
    payload: id,
  });

  // Then replace basket in local storage with updated basket contents
  localStorage.setItem(
    "basketItems",
    JSON.stringify(getState().basket.basketItems)
  );
};

export const saveShippingAddress = (data) => async (dispatch) => {
  // Dispatch to save address
  dispatch({
    type: BASKET_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });

  // Also save address to LS
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => async (dispatch) => {
  // Dispatch to save payment method
  dispatch({
    type: BASKET_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  // Also save payment method to LS
  localStorage.setItem("paymentMethod", JSON.stringify(data));
};
