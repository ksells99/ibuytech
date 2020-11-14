import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loading from "../components/Loading";
import { getUserDetails, updateUserProfile } from "../actions/userActions";

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

  //   Get profile update success status
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  useEffect(() => {
    // If user isn't logged in, redirect to login screen
    if (!userInfo) {
      history.push("/login");
    } else {
      // If no user details in state, get them
      if (!user.name) {
        dispatch(getUserDetails("profile"));
        // If data exists, add to form state
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
    <Row>
      <Col md={3}>
        <h2>Profile</h2>
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

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Save Details
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>Your Orders</h2>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
