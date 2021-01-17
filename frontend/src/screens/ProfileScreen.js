import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import Message from "../components/Message";
import Loading from "../components/Loading";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { getUserOrderList } from "../actions/orderActions";
import Meta from "../components/Meta";

const ProfileScreen = ({ location, history }) => {
  // Initial register form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  //   Get user info from state
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  //   Get user login status from state
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  //   Get user's orders from state
  const userOrders = useSelector((state) => state.userOrders);
  const {
    loading: loadingUserOrders,
    error: errorUserOrders,
    orders,
  } = userOrders;

  //   Get profile update success status
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    dispatch(getUserOrderList());
    // If user isn't logged in, redirect to login screen
    console.log(user);
    if (!userInfo) {
      history.push("/login");
    } else {
      // If no user details in state, get them
      if (!user || !user.name) {
        dispatch(getUserDetails("profile"));
        // Get user orders
        dispatch(getUserOrderList());

        // If user data exists, add to form state
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, history, userInfo, user]);

  // When save button clicked
  const submitHandler = (e) => {
    e.preventDefault();

    // Check passwords match - show error if so
    if (password !== password2) {
      setMessage("Password fields do not match");
    } else {
      // If all OK, clear error and dispatch update profile action - pass in form data + user ID

      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <div>
      <Meta title={`My Profile | iBuyTech`} />

      <Row>
        <Col lg={3}>
          <h3>Profile</h3>
          {message && <Message variant='danger'>{message}</Message>}
          {error && <Message variant='danger'>{error}</Message>}
          {success && (
            <Message variant='success'>Your profile has been updated.</Message>
          )}
          {loading && <Loading />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter your name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <hr />

            <Form.Group controlId='password'>
              <Form.Label>Change Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter a new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm new password'
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <hr />

            <Button type='submit' variant='primary' className='text-black'>
              Save Details
            </Button>
          </Form>
        </Col>

        {/* USER ORDERS LIST */}
        <Col lg={9}>
          <h3 className='responsive-margin'>Your Orders</h3>
          {loadingUserOrders ? (
            <Loading />
          ) : errorUserOrders ? (
            <Message variant='danger'>{errorUserOrders}</Message>
          ) : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <Link className='text-dark' to={`/order/${order._id}`}>
                        <Moment format='DD/MM/YYYY HH:mm'>
                          {order.createdAt}
                        </Moment>
                      </Link>
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        <i
                          className='fas fa-check'
                          style={{ color: "green" }}
                        ></i>
                      ) : (
                        <i
                          className='fas fa-times'
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <Moment format='DD/MM/YYYY'>{order.deliveredAt}</Moment>
                      ) : (
                        <i
                          className='fas fa-times'
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProfileScreen;
