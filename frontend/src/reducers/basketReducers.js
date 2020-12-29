import {
  BASKET_ADD_ITEM,
  BASKET_REMOVE_ITEM,
  BASKET_SAVE_SHIPPING_ADDRESS,
  BASKET_SAVE_PAYMENT_METHOD,
  BASKET_CLEAR_ITEMS,
  GET_USER_BASKET_REQUEST,
  GET_USER_BASKET_SUCCESS,
  GET_USER_BASKET_FAIL,
} from "../types/basketTypes";

export const basketReducer = (
  state = { basketItems: [], shippingAddress: {}, paymentMethod: null },
  action
) => {
  switch (action.type) {
    case BASKET_ADD_ITEM:
      const item = action.payload;

      // Check if item already in basket
      const itemAlreadyInBasket = state.basketItems.find(
        (x) => x.product === item.product
      );

      // If it is
      if (itemAlreadyInBasket) {
        return {
          // Return current state
          ...state,
          // Map through basket to find the same item being added - and replace it
          basketItems: state.basketItems.map((x) =>
            x.product === itemAlreadyInBasket.product ? item : x
          ),
        };

        // If not already in basket, add it
      } else {
        return {
          ...state,
          basketItems: [...state.basketItems, item],
        };
      }
    case BASKET_REMOVE_ITEM:
      return {
        ...state,
        // Filter basketItems to not show the item the user removed
        basketItems: state.basketItems.filter(
          (item) => item.product !== action.payload
        ),
      };
    case BASKET_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case BASKET_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    default:
      return state;
  }
};
