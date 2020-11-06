import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import Loading from "../components/Loading";
import Message from "../components/Message";

import {
  listProductDetails,
  clearProductDetails,
} from "../actions/productActions";

const ProductScreen = ({ match }) => {
  const dispatch = useDispatch();

  // Get productDetails from state
  const productDetails = useSelector((state) => state.productDetails);
  // Destructure and pull out required data
  const { loading, error, product } = productDetails;

  useEffect(() => {
    // Calls listProducts action - passes in product ID from URL
    dispatch(listProductDetails(match.params.id));

    // Clear product state when leaving page
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, match]);

  return (
    <div>
      <Link className='btn btn-dark my-3' to='/'>
        Back
      </Link>
      {/* If loading=true, show loading component, if error, show error msg component - else show data */}
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {/* IMAGE */}
          <Col md={6}>
            {/* Fluid = keeps image within parent container */}
            <Image src={product.image} alt={product.name} fluid />
          </Col>

          {/* PRODUCT DETAILS */}
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h4>{product.name}</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                {/* RATING COMPONENT */}
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <p>£{product.price}</p>
              </ListGroup.Item>
              <ListGroup.Item>
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* STOCK & BASKET */}
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                {/* PRICE */}
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>£{product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* STOCK AVAILABILITY */}
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* ADD TO BASKET BTN */}
                <ListGroup.Item>
                  {/* Button disabled if item out of stock */}
                  <Button
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                  >
                    Add to Basket
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ProductScreen;
