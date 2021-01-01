import axios from "axios";

import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  ALL_USERS_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  USER_UPDATE_SHIPPING_ADDRESS_REQUEST,
  USER_UPDATE_SHIPPING_ADDRESS_SUCCESS,
  USER_UPDATE_SHIPPING_ADDRESS_FAIL,
} from "../types/userTypes";
import { ORDER_DETAILS_RESET, USER_ORDERS_CLEAR } from "../types/orderTypes";
import { BASKET_CLEAR } from "../types/basketTypes";

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Make login request to API - pass in email/PW and config
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );

    // Then send data to reducer
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // Also save user details to local storage
    localStorage.setItem("userInfo", JSON.stringify(data));

    //
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  // Remove data from LS
  localStorage.removeItem("userInfo");
  localStorage.removeItem("basketItems");
  localStorage.removeItem("shippingAddress");
  localStorage.removeItem("paymentMethod");

  // Dispatch to reducer to update state
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_ORDERS_CLEAR });
  dispatch({ type: ORDER_DETAILS_RESET });
  dispatch({ type: BASKET_CLEAR });
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Make register request to API - post to create new user - pass in name/email/PW and config
    const { data } = await axios.post(
      "/api/users",
      { name, email, password },
      config
    );

    // Then send data to reducer
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    // Automatically login user after registration
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // Also save user details to local storage
    localStorage.setItem("userInfo", JSON.stringify(data));

    //
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// GET USER PROFILE/DETAILS
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Make get request to API to get profile data from user route
    const { data } = await axios.get(`/api/users/${id}`, config);

    // Then send data to reducer
    dispatch({
      type: USER_DETAILS_SUCCESS,
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
      type: USER_DETAILS_FAIL,
      payload: message,
    });
  }
};

// UPDATE USER PROFILE/DETAILS
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Send new user data to users/profile route - PUT request
    const { data } = await axios.put(`/api/users/profile`, user, config);

    // Then send data to reducer
    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    // Also send data to USER_LOGIN_SUCCESS & USER_DETAILS_SUCCESS in order to update other user state (navbar & form)
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));

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
      type: USER_UPDATE_PROFILE_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload: message,
    });
  }
};

// UPDATE USER SHIPPING ADDRESS
export const updateUserShippingAddress = (shippingAddress) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: USER_UPDATE_SHIPPING_ADDRESS_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // Send new user data to users/shipping route - PUT request
    const { data } = await axios.put(
      `/api/users/shipping`,
      shippingAddress,
      config
    );

    // Then send data to reducer
    dispatch({
      type: USER_UPDATE_SHIPPING_ADDRESS_SUCCESS,
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
      type: USER_UPDATE_SHIPPING_ADDRESS_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload: message,
    });
  }
};

// GET ALL USERS
export const getUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: ALL_USERS_REQUEST,
    });

    const config = {
      headers: {
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users`, config);

    // Then send data to reducer
    dispatch({
      type: ALL_USERS_SUCCESS,
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
      type: ALL_USERS_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload: message,
    });
  }
};

// DELETE USER
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DELETE_USER_REQUEST,
    });

    const config = {
      headers: {
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/users/${id}`, config);

    dispatch({
      type: DELETE_USER_SUCCESS,
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
      type: DELETE_USER_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload: message,
    });
  }
};

// UPDATE USER (ADMIN)
export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        // Get token from userInfo state
        Authorization: `Bearer ${getState().userLogin.userInfo.token}`,
      },
    };

    // PUT request to update - pass in new user object
    const { data } = await axios.put(`/api/users/${user._id}`, user, config);

    dispatch({
      type: USER_UPDATE_SUCCESS,
    });

    dispatch({
      type: USER_DETAILS_SUCCESS,
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
      type: USER_UPDATE_FAIL,
      // If specific error returned, dispatch it, otherwise dispatch generic error
      payload: message,
    });
  }
};
