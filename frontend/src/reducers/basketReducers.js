import { BASKET_ADD_ITEM, BASKET_REMOVE_ITEM } from "../types/basketTypes";

export const basketReducer = (state = { basketItems: [] }, action) => {
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
    default:
      return state;
  }
};
