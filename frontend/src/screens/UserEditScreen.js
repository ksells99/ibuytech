import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loading from "../components/Loading";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../types/userTypes";

const UserEditScreen = ({ match, history }) => {
  // Get user ID from URL
  const userId = match.params.id;

  // Initial user form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  //   Get user info & update status from state
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.updateUser);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      //   Reset update state in case wanting to edit another user
      dispatch({ type: USER_UPDATE_RESET });

      history.push("/admin/userlist");
    } else {
      //   If no user in state OR user in state is different to ID from URL, dispatch action to get details
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));

        // Otherwise fill form state with user data
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [user, dispatch, userId, successUpdate, history]);

  // When save button clicked
  const submitHandler = (e) => {
    e.preventDefault();
    // Dispatch update action, pass in ID and info from form
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <div>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Back
      </Link>

      {/* //   EDIT USER FORM */}
      <FormContainer>
        <h3>Edit User</h3>
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
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='isAdmin'>
              <Form.Check
                type='checkbox'
                label='Admin?'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary' className='text-black'>
              Save User
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default UserEditScreen;
