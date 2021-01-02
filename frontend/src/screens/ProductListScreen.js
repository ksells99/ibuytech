import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loading from "../components/Loading";
import {
  listActiveAndInactiveProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../types/productTypes";

const ProductListScreen = ({ history, match }) => {
  // // Check URL for page number - if not present, use 1
  // const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  //   Get state
  const productList = useSelector((state) => state.adminProductList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // Reset create product state
    dispatch({ type: PRODUCT_CREATE_RESET });

    //   If logged in user is not an admin, push to login
    if (userInfo && !userInfo.isAdmin) {
      history.push("/login");
    }

    // If product has been successfully added, redirect to edit screen
    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);

      // Else dispatch action to get list (pass in empty string for keyword (as not used for admin) & page num)
    } else {
      dispatch(listActiveAndInactiveProducts());
    }
  }, [dispatch, history, userInfo, successDelete, successCreate]);

  // const deleteProductHandler = (id) => {
  //   if (
  //     window.confirm(
  //       `Are you sure you wish to delete product ${id}? This will also delete any orders containing the product!`
  //     )
  //   ) {
  //     // Dispatch action to delete, pass in ID
  //     dispatch(deleteProduct(id));
  //   }
  // };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <Row className='align-items-center'>
        <Col>
          <h3>Products</h3>
        </Col>
        <Col className='text-right'>
          <Button className='my-3 text-black' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Add Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loading />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loading />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Active?</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Category</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>
                    {product.isActive ? (
                      <i
                        className='fas fa-check'
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className='fas fa-times' style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.brand}</td>
                  <td>£{product.price}</td>
                  <td>{product.category}</td>

                  {/* Edit/delete user product */}
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    {/* <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default ProductListScreen;
