import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loading from "../components/Loading";
import Message from "../components/Message";
import { listProducts } from "../actions/productActions";

const HomeScreen = () => {
  const dispatch = useDispatch();

  // Get productList from state
  const productList = useSelector((state) => state.productList);
  // Destructure and pull out required data
  const { loading, error, products } = productList;

  useEffect(() => {
    // Calls listProducts action
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div>
      <h3>Latest Products</h3>
      {/* If loading=true, show loading component, if error, show error msg component - else show data */}
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            // Responsive column amounts
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HomeScreen;
