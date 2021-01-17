import React, { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import { getUserDetails } from "../actions/userActions";
import Meta from "../components/Meta";

const PlaceOrderScreen = ({ history }) => {
  // Get basket from state
  const basket = useSelector((state) => state.basket);

  //   Get user info (contains saved shipping address) from state
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  // Function to ensure totals below are always 2dp
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // Calculate total item price
  basket.itemsPrice = addDecimals(
    basket.basketItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )
  );

  //   Shipping price - free if order above £50
  basket.shippingPrice = addDecimals(basket.itemsPrice > 50 ? 0 : 4.99);

  //   Tax price - always £0
  basket.taxPrice = addDecimals(Number((0 * basket.itemsPrice).toFixed(2)));

  // TOTAL price
  basket.totalPrice = (
    Number(basket.itemsPrice) +
    Number(basket.shippingPrice) +
    Number(basket.taxPrice)
  ).toFixed(2);

  const dispatch = useDispatch();

  // Get ordercreate data from state - picks up if new order was successful or fails
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    // If no user details in state, get them
    if (userDetails && !user.shippingAddress) {
      dispatch(getUserDetails("profile"));
    }
    if (success) {
      // If order successful, take user to details of the order
      history.push(`/order/${order._id}`);
    }

    // eslint-disable-next-line
  }, [history, success, order, user]);

  const placeOrderHandler = () => {
    // Dispatch create order action, pass in items, address, pricing from basket
    dispatch(
      createOrder({
        orderItems: basket.basketItems,
        shippingAddress: user.shippingAddress,
        paymentMethod: basket.paymentMethod,

        shippingPrice: basket.shippingPrice,
        taxPrice: basket.taxPrice,
        totalPrice: basket.totalPrice,
      })
    );
  };

  return (
    <div>
      <Meta title={`Checkout | iBuyTech`} />
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>Shipping</h3>
              <p>
                <strong>Address: </strong>
                {user.shippingAddress && user.shippingAddress.address},{" "}
                {user.shippingAddress && user.shippingAddress.city},{" "}
                {user.shippingAddress && user.shippingAddress.postalCode},{" "}
                {user.shippingAddress && user.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>Payment Method</h3>
              <strong>Method: </strong>
              {basket.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>Items</h3>
              {basket.basketItems.length === 0 ? (
                <Message>
                  Your basket is empty. Add some items to complete your order.
                </Message>
              ) : (
                <ListGroup variant='flush'>
                  {basket.basketItems.map((item, index) => (
                    <ListGroup.Item key={index} style={{ paddingLeft: "0px" }}>
                      <Row>
                        <Col>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link
                            class='text-dark'
                            to={`/product/${item.product}`}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.quantity} x £{item.price} = £
                          {Number(item.quantity * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>Order Summary</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>£{basket.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>£{basket.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>£{basket.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>
                    <strong>£{basket.totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message variant='danger'>{error}</Message>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block text-black'
                  variant='primary'
                  disabled={basket.basketItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
