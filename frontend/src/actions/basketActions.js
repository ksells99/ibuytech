import axios from "axios";
import { BASKET_ADD_ITEM, BASKET_REMOVE_ITEM } from "../types/basketTypes";

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
