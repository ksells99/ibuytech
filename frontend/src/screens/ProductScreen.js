import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import products from "../products";

const ProductScreen = ({ match }) => {
  // Find product based on ID from URL using match
  const product = products.find((product) => product._id === match.params.id);

  return (
    <div>
      <Link className='btn btn-dark my-3' to='/'>
        Back
      </Link>
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
    </div>
  );
};

export default ProductScreen;
