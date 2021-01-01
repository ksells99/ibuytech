import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loading from "../components/Loading";
import { getUsers, deleteUser } from "../actions/userActions";

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();

  //   Get all users & logged in user from state
  const userList = useSelector((state) => state.allUsers);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Also get userDelete state
  const userDelete = useSelector((state) => state.deleteUser);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    //   If logged in user is an admin, dispatch action to get user list
    if (userInfo && userInfo.isAdmin) {
      dispatch(getUsers());

      //   Else redirect to login
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deleteHandler = (id, name) => {
    if (window.confirm(`Are you sure you wish to delete ${name}?`)) {
      // Dispatch action to delete user - pass in ID
      dispatch(deleteUser(id));
    }
  };

  return (
    <div>
      <h3>Users</h3>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Email</th>
              <th>Admin?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                {/* <td>{user._id}</td> */}
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`} className='text-dark'>
                    {user.email}
                  </a>
                </td>
                {/* Show tick/cross depending on admin status */}
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{ color: "green" }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: "red" }}></i>
                  )}
                </td>

                {/* Edit/delete user buttons */}
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id, user.name)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListScreen;
