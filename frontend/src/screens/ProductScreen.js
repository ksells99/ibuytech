import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Loading from "../components/Loading";
import Message from "../components/Message";

import {
  listProductDetails,
  clearProductDetails,
} from "../actions/productActions";

const ProductScreen = ({ history, match }) => {
  const [quantity, setQuantity] = useState(1);

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

  const addToBasketHandler = () => {
    history.push(`/basket/${match.params.id}?qty=${quantity}`);
  };

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

                {/* QTY SELECT - only show if product in stock */}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        {/* DROP DOWN BOX FOR QTY */}
                        <Form.Control
                          as='select'
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        >
                          {/* Convert count in stock to array and get number, then show option for each (+1 as starting at 0) */}
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                {/* ADD TO BASKET BTN */}
                <ListGroup.Item>
                  {/* Button disabled if item out of stock */}
                  <Button
                    onClick={addToBasketHandler}
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
