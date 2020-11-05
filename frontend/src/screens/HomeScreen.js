import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios";

const HomeScreen = () => {
  // Component-level state
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      // Fetch from API & pass into products state
      const res = await axios.get("/api/products");
      setProducts(res.data);
    };

    getProducts();
  }, []);

  return (
    <div>
      <h3>Latest Products</h3>
      <Row>
        {products.map((product) => (
          // Responsive column amounts
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomeScreen;
