import React, { useState } from "react";

import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/basketActions";
import Meta from "../components/Meta";

const PaymentScreen = ({ history }) => {
  // // Get basket from state
  // const basket = useSelector((state) => state.basket);
  // // Then pull out shippingAddress
  // const { shippingAddress } = basket;

  //   Get user info (contains saved shipping address) from state
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  //   If no shipping address, redirect back to address page
  if (!user.shippingAddress.address) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch action to save payment method
    dispatch(savePaymentMethod(paymentMethod));
    // Proceed to place order
    history.push("/placeorder");
  };

  return (
    <div>
      <Meta title={`Checkout | iBuyTech`} />
      <FormContainer>
        <h1>Checkout</h1>
        <CheckoutSteps step1 step2 />
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as='legend'>Select payment method</Form.Label>

            <Col>
              {/* PAYMENT METHOD RADIO BUTTONS */}
              <Form.Check
                type='radio'
                label='PayPal or Debit/Credit Card'
                id='PayPal'
                name='paymentMethod'
                value='PayPal'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Continue
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default PaymentScreen;
