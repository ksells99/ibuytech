import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CheckoutFormContainer from "../components/CheckoutFormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  updateUserShippingAddress,
  getUserDetails,
} from "../actions/userActions";
import Meta from "../components/Meta";

const ShippingScreen = ({ history }) => {
  //   Get user info (contains saved shipping address) from state
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  // Add this address to initial form state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    // If no user details in state, get them
    if (userDetails && !user.shippingAddress) {
      dispatch(getUserDetails("profile"));

      // If user data exists, add to form state
    } else {
      setAddress(user.shippingAddress.address);
      setCity(user.shippingAddress.city);
      setPostalCode(user.shippingAddress.postalCode);
      setCountry(user.shippingAddress.country);
    }

    // eslint-disable-next-line
  }, [dispatch, history, user]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch action to save address
    dispatch(updateUserShippingAddress({ address, city, postalCode, country }));
    // Proceed to payment screen
    history.push("/payment");
  };

  return (
    <div>
      <Meta title={`Checkout | iBuyTech`} />
      <CheckoutFormContainer className='checkout'>
        <h3 className='text-center'>Checkout</h3>
        <CheckoutSteps step1 />
        <h5 className='font-weight-bold mb-4'>Shipping</h5>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='address'>
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter address'
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='city'>
            <Form.Label>Town/City</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter town/city'
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='postalCode'>
            <Form.Label>Postcode</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter postcode'
              value={postalCode}
              required
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='country'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter country'
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Continue
          </Button>
        </Form>
      </CheckoutFormContainer>
    </div>
  );
};

export default ShippingScreen;
