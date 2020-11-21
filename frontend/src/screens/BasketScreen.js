import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToBasket, removeFromBasket } from "../actions/basketActions";

const BasketScreen = ({ match, location, history }) => {
  // Get product ID of item added to basket from URL - won't be present if going directly to basket page
  const productId = match.params.id;

  // Location.search gets query string from URL showing qty - only want number from ?qty=1 - if not there, just use 1
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();

  // Get basket contents from state
  const basket = useSelector((state) => state.basket);
  const { basketItems } = basket;

  useEffect(() => {
    // If product ID exists in URL (i.e. add to basket button clicked), dispatch action to add it to basket - pass in ID and qty
    if (productId) {
      dispatch(addToBasket(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromBasketHandler = (id) => {
    dispatch(removeFromBasket(id));
    // Redirect to basket - prevents a page reload re-adding item to basket
    history.push("/basket");
  };

  const checkoutHandler = () => {
    // Redirect to login screen if user not signed in, otherwise go to shipping screen
    history.push("/login?redirect=shipping");
  };

  return (
    <Row>
      {/* BASKET */}
      <Col md={8}>
        <h3 className=' p-3'>Shopping Basket</h3>

        {/* If basket is empty, show message */}
        {basketItems.length === 0 ? (
          <Message>
            Your shopping basket is currently empty.{" "}
            <Link to='/'>VIEW PRODUCTS</Link>
          </Message>
        ) : (
          // Otherwise list basket items
          <ListGroup variant='flush'>
            {/* Loop through basket items and display info */}
            {basketItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>£{item.price}</Col>
                  <Col md={2}>
                    {/* DROP DOWN BOX FOR CHANGING QTY */}
                    <Form.Control
                      as='select'
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          addToBasket(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {/* Convert count in stock to array and get number, then show option for each (+1 as starting at 0) */}
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromBasketHandler(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      {/* SUB-TOTAL / CHECKOUT */}
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              {/* Calculate total number of items/qty in basket */}
              <h5>
                Subtotal (
                {basketItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                items)
              </h5>
              {/* Calculate total price of all items in basket */}£
              {basketItems
                .reduce((acc, item) => acc + item.quantity * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn btn-block'
                disabled={basketItems.length === 0}
                onClick={checkoutHandler}
              >
                CHECKOUT
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default BasketScreen;
