import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Moment from "react-moment";
import Message from "../components/Message";
import Loading from "../components/Loading";
import { getAllOrders } from "../actions/orderActions";
import Meta from "../components/Meta";

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();

  //   Get all orders & logged in user from state
  const allOrders = useSelector((state) => state.allOrders);
  const { loading, error, orders } = allOrders;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    //   If logged in user is an admin, dispatch action to get order list
    if (userInfo && userInfo.isAdmin) {
      dispatch(getAllOrders());

      //   Else redirect to login
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  return (
    <div>
      <Meta title={`Order List - Admin | iBuyTech`} />
      <h3>Orders</h3>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th className='hide-md'>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total Price</th>
              <th>Paid?</th>
              <th>Delivered?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className='hide-md'>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>
                  <Moment format='DD/MM/YYYY'>{order.createdAt}</Moment>
                </td>
                <td>£{order.totalPrice}</td>

                <td>
                  {order.isPaid ? (
                    <i className='fas fa-check' style={{ color: "green" }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <Moment format='DD/MM/YYYY'>{order.deliveredAt}</Moment>
                  ) : (
                    <i className='fas fa-times' style={{ color: "red" }}></i>
                  )}
                </td>

                {/* View order button */}
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-eye'></i>
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OrderListScreen;
