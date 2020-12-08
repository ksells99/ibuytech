import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_PRODUCT_DETAILS,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
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

// DELETE PRODUCT
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });

    const config = {
      headers: {
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Send delete request to API
    await axios.delete(`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });

    //
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// CREATE PRODUCT
export const createProduct = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    });

    const config = {
      headers: {
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Send post request to API
    const { data } = await axios.post(`/api/products`, {}, config);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });

    //
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Send put request to API, pass in updated product info
    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    );

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });

    //
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
