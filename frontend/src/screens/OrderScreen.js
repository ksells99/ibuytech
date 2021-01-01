import React, { useState, useEffect } from "react";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Message from "../components/Message";
import Loading from "../components/Loading";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
  ORDER_CREATE_RESET,
} from "../types/orderTypes";

const OrderScreen = ({ match, history }) => {
  // Get order ID from URL
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  // Get orderdetails/userinfo (used to check if admin) & pay/delivered data from state
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading) {
    // Function to ensure item totals below are always 2dp
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    // Calculate total item price
    order.itemsPrice = addDecimals(
      order.orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      )
    );
  }

  useEffect(() => {
    // Reset order create - PlaceOrderScreen links to this screen when order is successful - if this isn't reset it won't allow user to make another order in the session
    dispatch({ type: ORDER_CREATE_RESET });

    // Redirect to login if user not logged in
    if (!userInfo) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      // Get PP client ID from server
      const { data: clientId } = await axios.get("/api/config/paypal");

      // Build script for PP SDK
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;

      // Set ready to true once script loaded created
      script.onload = () => {
        setSdkReady(true);
      };

      // Then add script to root HTML
      document.body.appendChild(script);
    };

    // Get order details if no order in state, or if payment/delivery state changes
    if (!order || order._id !== orderId || successPay || successDeliver) {
      // Dispatch to reducer to set pay/deliver sucess back to null - otherwise will be in a loop
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });

      // Get order details
      dispatch(getOrderDetails(orderId));

      // Else if order isn't paid
    } else if (!order.isPaid) {
      // If PP script isn't there, add it
      if (!window.paypal) {
        addPayPalScript();

        // If it is, set sdkReady to true
      } else {
        setSdkReady(true);
      }
    }
  }, [order, orderId, successPay, successDeliver, dispatch]);

  const successPaymentHandler = (paymentResult) => {
    // Dispatch pay action - pass in ID and result from PP
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    // Dispatch action to mark order as delivered, pass in order
    dispatch(deliverOrder(order));
    console.log(order);
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <div>
      <section style={{ padding: ".75rem 1.25rem" }}>
        <h3>
          Order <Moment format='DD/MM/YYYY HH:mm'>{order.createdAt}</Moment>
        </h3>
        <p>ID: {order._id}</p>
      </section>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h4>Shipping</h4>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>

              <p>
                <strong>Email address: </strong>
                <a href={`mailto:${order.user.email}`} className='text-dark'>
                  {order.user.email}
                </a>
              </p>
              <p>
                <strong>Shipping address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  <i className='fas fa-truck'></i> Delivered on{" "}
                  <Moment format='DD/MM/YYYY HH:mm'>{order.deliveredAt}</Moment>
                </Message>
              ) : (
                <Message variant='warning'>
                  <i className='fas fa-exclamation-triangle'></i> Order not
                  delivered
                </Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Payment Method</h4>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  <i className='far fa-credit-card'></i> Paid on{" "}
                  <Moment format='DD/MM/YYYY HH:mm'>{order.paidAt}</Moment>
                </Message>
              ) : (
                <Message variant='warning'>
                  <i className='fas fa-exclamation-triangle'></i> Order not yet
                  paid
                </Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Order Items</h4>
              {order.orderItems.length === 0 ? (
                <Message>Order contains no items.</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item style={{ paddingLeft: "0px" }} key={index}>
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
                            to={`/product/${item.product}`}
                            className='text-dark'
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
                  <Col>£{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>£{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>£{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>
                    <strong>£{order.totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {/* PAYPAL BUTTON */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loading />}
                  {!sdkReady ? (
                    <Loading />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}

              {/* MARK AS DELIVERED BUTTON - only visible to admin */}
              {loadingDeliver && <Loading />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
