import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loading from "../components/Loading";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { listProducts } from "../actions/productActions";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

const HomeScreen = ({ match }) => {
  // Check for search keyword & page number (default 1)
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  // Get productList from state
  const productList = useSelector((state) => state.productList);
  // Destructure and pull out required data
  const { loading, error, products, pages, page } = productList;

  useEffect(() => {
    // Calls listProducts action - pass in search term if exists, & page number
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <div>
      <Meta />
      {/* Featured products carousel - don't show if search results */}
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-dark'>
          Back
        </Link>
      )}

      <h3 className='mt-5'>
        {!keyword ? "Latest Products" : `Search results for '${keyword}'`}
      </h3>
      {/* If loading=true, show loading component, if error, show error msg component - else show data */}
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              // Responsive column amounts

              <Col
                className='card-container'
                key={product._id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
              >
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {/* Pagination - pass in num pages and current page, and search term */}
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </div>
  );
};

export default HomeScreen;
