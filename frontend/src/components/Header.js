import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { logout } from "../actions/userActions";
import SearchBar from "./SearchBar";

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // Get user info from state - can then check if user is logged in, then determines which links are visible
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Get no. of basket items from state - used for badge count
  const basket = useSelector((state) => state.basket);
  const { basketItems } = basket;

  const logoutHandler = () => {
    // Dispatch action to logout
    dispatch(logout());
    // Redirect to login screen
    history.push("/login");
  };

  return (
    <header style={{ width: "100vw" }}>
      <Navbar bg='' variant='light' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <h2 style={{ fontWeight: "600" }}>iBuyTech</h2>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />

          <Navbar.Collapse id='basic-navbar-nav'>
            {/* Search box - need to get history to pass in as prop */}
            <Route render={({ history }) => <SearchBar history={history} />} />
            <Nav className='ml-auto'>
              {userInfo && userInfo.isAdmin ? null : (
                <LinkContainer to='/basket'>
                  <Nav.Link exact>
                    <i className='fas fa-shopping-cart mr-2'></i>

                    {basketItems && basketItems.length > 0
                      ? `Basket (${basketItems
                          .reduce((acc, item) => acc + Number(item.quantity), 0)
                          .toString()
                          .replace(/^0+/, "")})`
                      : "Basket"}
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* IF USER LOGGED IN, SHOW PROFILE/OPTIONS - ELSE SHOW LOGIN LINK */}
              {/* IF ADMIN, HIDE THESE */}
              {userInfo ? (
                !userInfo.isAdmin ? (
                  <>
                    <NavDropdown
                      // Show first name only - split at space if exists, then get first item (first name)
                      title={userInfo.name.split(" ")[0]}
                      id='username'
                    >
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                ) : null
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user mr-2'></i>Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* IF ADMIN, SHOW USER LIST LINK */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title={userInfo.name} id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
