import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loading from "../components/Loading";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../types/productTypes";

const ProductEditScreen = ({ match, history }) => {
  // Get product ID from URL
  const productId = match.params.id;

  // Initial product form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  //   Get product info & update status from state
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    // If update was successful...
    if (successUpdate) {
      // Clear state & redirect back to product list
      dispatch({ type: PRODUCT_UPDATE_RESET });
      history.push("/admin/productlist");
    } else {
      //   If no product in state OR product in state is different to ID from URL, dispatch action to get details
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));

        // Otherwise fill form state with product data
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setDescription(product.description);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
      }
    }
  }, [product.name, dispatch, productId, history, successUpdate]);

  // Image upload handler
  const uploadFileHandler = async (e) => {
    // Get files user selected - only get first one
    const file = e.target.files[0];
    // Initialise form data object
    const formData = new FormData();
    // Append to it - add file user selected
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      // Upload image to API - data returned = file path
      const { data } = await axios.post("/api/upload", formData, config);

      // Update image path in state
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  // When save button clicked
  const submitHandler = (e) => {
    e.preventDefault();
    // Call update product action, pass in new product info from form
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        category,
        brand,
        description,
        countInStock,
      })
    );
  };

  return (
    <div>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Back
      </Link>

      {/* //   EDIT PRODUCT FORM */}
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loading />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

        {/* If loading, show loader - if error, show message - otherwise show form */}
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Product name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Prices</Form.Label>
              <Form.Control
                type='number'
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type='text'
                placeholder='Image URL'
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              ></Form.Control>

              {/* Image upload button */}
              <Form.File
                id='image-file'
                label='Upload Image'
                className='mt-2'
                custom
                onChange={uploadFileHandler}
                accept='image/jpg, image/jpeg, image/png'
              ></Form.File>

              {/* If file currently uploading, show loader */}
              {uploading && <Loading />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Number in stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='text-black'>
              Save Product
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default ProductEditScreen;
