import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_RESET,
  USER_ORDERS_REQUEST,
  USER_ORDERS_SUCCESS,
  USER_ORDERS_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
} from "../types/orderTypes";
import axios from "axios";
import { logout } from "./userActions";

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_CREATE_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Send new order data to route - pass in order object
    const { data } = await axios.post(`/api/orders`, order, config);

    // Then send data to reducer
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });

    //
  } catch (error) {
    // Check if message contains failed token (expired) - if so, logout user
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorised - token failed") {
      dispatch(logout());
    }
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: message,
    });
  }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DETAILS_REQUEST,
    });

    const config = {
      headers: {
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Get data from API - pass in order ID & token
    const { data } = await axios.get(`/api/orders/${id}`, config);

    // Then send data to reducer
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });

    //
  } catch (error) {
    // Check if message contains failed token (expired) - if so, logout user
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorised - token failed") {
      dispatch(logout());
    }

    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: message,
    });
  }
};

export const payOrder = (orderId, paymentResult) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: ORDER_PAY_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Put request to API - pass in paymentResult
    const { data } = await axios.put(
      `/api/orders/${orderId}/pay`,
      paymentResult,
      config
    );

    // Then send data to reducer
    dispatch({
      type: ORDER_PAY_SUCCESS,
      payload: data,
    });

    //
  } catch (error) {
    // Check if message contains failed token (expired) - if so, logout user
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorised - token failed") {
      dispatch(logout());
    }

    dispatch({
      type: ORDER_PAY_FAIL,
      payload: message,
    });
  }
};

// DELIVERED
export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DELIVER_REQUEST,
    });

    const config = {
      headers: {
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Put request to API
    const { data } = await axios.put(
      `/api/orders/${order._id}/deliver`,
      {},
      config
    );

    // Then send data to reducer
    dispatch({
      type: ORDER_DELIVER_SUCCESS,
      payload: data,
    });

    //
  } catch (error) {
    // Check if message contains failed token (expired) - if so, logout user
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorised - token failed") {
      dispatch(logout());
    }

    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload: message,
    });
  }
};

// USER ORDERS
export const getUserOrderList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_ORDERS_REQUEST,
    });

    const config = {
      headers: {
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Get data from API
    const { data } = await axios.get("/api/orders/myorders", config);

    // Then send data to reducer
    dispatch({
      type: USER_ORDERS_SUCCESS,
      payload: data,
    });

    //
  } catch (error) {
    // Check if message contains failed token (expired) - if so, logout user
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorised - token failed") {
      dispatch(logout());
    }

    dispatch({
      type: USER_ORDERS_FAIL,
      payload: message,
    });
  }
};

// ALL ORDERS
export const getAllOrders = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ALL_ORDERS_REQUEST,
    });

    const config = {
      headers: {
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Get data from API
    const { data } = await axios.get("/api/orders", config);

    // Then send data to reducer
    dispatch({
      type: ALL_ORDERS_SUCCESS,
      payload: data,
    });

    //
  } catch (error) {
    // Check if message contains failed token (expired) - if so, logout user
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorised - token failed") {
      dispatch(logout());
    }

    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: message,
    });
  }
};
