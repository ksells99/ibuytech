import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  CLEAR_PRODUCT_DETAILS,
} from "../types/productTypes";

// ALL PRODUCTS
export const productListReducer = (
  state = { products: [], error: null, loading: false },
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return {
        loading: true,
        products: [],
      };
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload,
      };
    case PRODUCT_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      // Return initial state (empty array of products)
      return state;
  }
};

// SPECIFIC PRODUCT DETAILS
export const productDetailsReducer = (
  state = { product: { reviews: [] }, error: null, loading: false },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        loading: true,
        product: { reviews: [] },
      };
    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload,
      };
    case PRODUCT_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_PRODUCT_DETAILS:
      return {
        loading: true,
        product: { reviews: [] },
      };

    default:
      // Return initial state (empty array of products)
      return state;
  }
};
