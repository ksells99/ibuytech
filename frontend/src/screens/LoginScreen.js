import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loading from "../components/Loading";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";
import Meta from "../components/Meta";

const LoginScreen = ({ location, history }) => {
  // Initial login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  //   Get user info from state
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  //  Get redirect query from URL
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    // If user is logged in, redirect
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  // When login button clicked
  const submitHandler = (e) => {
    e.preventDefault();

    // Call login function in actions, Pass in email/pw
    dispatch(login(email, password));
  };

  return (
    <div>
      <Meta title={`Login | iBuyTech`} />
      {/* //   LOGIN FORM */}
      <FormContainer>
        <h3 className='my-4 font-weight-bold'>Login to your account</h3>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loading />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='text-black my-2'>
            Login
          </Button>
        </Form>

        <Row className='py-3'>
          <Col>
            Don't have an account?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className='text-dark'
            >
              <strong>Sign up</strong>
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </div>
  );
};

export default LoginScreen;
