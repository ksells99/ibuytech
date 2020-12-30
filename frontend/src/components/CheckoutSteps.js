import React from "react";
import { Nav, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <Nav className='justify-content-center mb-4' variant='tabs'>
      {/* Show links (active or disabled) depending on which step is being passed in */}

      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link className='text-dark'>
              <Badge variant='primary' className='text-dark'>
                1
              </Badge>{" "}
              Shipping
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <Badge variant='secondary' className='text-dark'>
              1
            </Badge>{" "}
            Shipping
          </Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/payment'>
            <Nav.Link className='text-dark'>
              <Badge variant='primary' className='text-dark'>
                2
              </Badge>{" "}
              Payment
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <Badge variant='secondary' className='text-dark'>
              2
            </Badge>{" "}
            Payment
          </Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link className='text-dark'>
              <Badge variant='primary' className='text-dark'>
                3
              </Badge>{" "}
              Confirm Order
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>
            <Badge variant='secondary' className='text-dark'>
              3
            </Badge>{" "}
            Confirm Order
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
