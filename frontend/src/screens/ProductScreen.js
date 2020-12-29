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
import Meta from "../components/Meta";

import {
  listProductDetails,
  clearProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../types/productTypes";

const ProductScreen = ({ history, match }) => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  // Get productDetails from state
  const productDetails = useSelector((state) => state.productDetails);
  // Destructure and pull out required data
  const { loading, error, product } = productDetails;

  // Also get Product review & user login info from state
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successReview, error: errorReview } = productReviewCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // If user has just submitted review
    if (successReview) {
      alert("Review added successfully");
      // Reset review form data
      setRating(1);
      setComment("");
      // Reset review state
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

    // Calls listProducts action - passes in product ID from URL
    dispatch(listProductDetails(match.params.id));

    // Clear product state when leaving page
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, match, successReview]);

  const addToBasketHandler = () => {
    history.push(`/basket/${match.params.id}?qty=${quantity}`);
  };

  const submitReviewHandler = (e) => {
    e.preventDefault();
    // Dispatch action to add review - pass in product ID (from URL), and review object from form data
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    );
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
        <div>
          <Meta title={`${product.name} | iBuyTech`} />
          <Row>
            {/* IMAGE */}
            <Col md={4}>
              {/* Fluid = keeps image within parent container */}
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            {/* PRODUCT DETAILS */}
            <Col md={5}>
              <ListGroup variant='flush'>
                <ListGroup.Item className='no-border'>
                  <h4>{product.name}</h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h5>£{product.price}</h5>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/* RATING COMPONENT */}
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
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
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
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

          <hr className='mt-5' />

          {/* REVIEWS */}
          <Row className='mt-5'>
            <Col md={6}>
              <h4>Reviews</h4>
              {/* Show message if no reviews */}
              {product.reviews.length === 0 && (
                <p>Be the first to review this product</p>
              )}

              <ListGroup variant='flush'>
                {/* Map through product reviews & list them */}

                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id} className='pl-0'>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                {/* ADD REVIEW FORM */}
                <ListGroup.Item>
                  <h6>
                    Write a product review for <strong>{product.name}</strong>
                  </h6>
                  {errorReview && (
                    <Message variant='danger'>{errorReview}</Message>
                  )}
                  {/* Show form if user logged in, otherwise show login link */}
                  {userInfo ? (
                    <Form onSubmit={submitReviewHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - OK</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='primary'>
                        Add Review
                      </Button>
                    </Form>
                  ) : (
                    <p>
                      <Link to='/login'>Login</Link> to write a review
                    </p>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;
