import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_PRODUCT_DETAILS,
} from "../types/productTypes";

// GET ALL PRODUCTS
export const listProducts = () => async (dispatch) => {
  try {
    // Send request to set loading to true
    dispatch({ type: PRODUCT_LIST_REQUEST });

    // Get data and dispatch
    const { data } = await axios.get("/api/products");
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      // If specific error returend, dispatch it, otherwise dispatch generic error
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// SPECIFIC PRODUCT DETAILS - takes in product id
export const listProductDetails = (id) => async (dispatch) => {
  try {
    // Send request to set loading to true
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    // Get data and dispatch
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      // If specific error returend, dispatch it, otherwise dispatch generic error
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// CLEAR PRODUCT DETAILS
export const clearProductDetails = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PRODUCT_DETAILS,
    payload: {},
  });
};
