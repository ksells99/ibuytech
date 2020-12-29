import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBar = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    //   Trim any whitespace from search query - if query exists, push to search page
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);

      //   Otherwise return to homepage if query is blank (show all products)
    } else {
      history.push("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline className='search-container'>
      <Form.Control
        type='text'
        name='query'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search products...'
        className='ml-lg-5 mr-lg-2'
      ></Form.Control>
      <Button type='submit' variant='dark' className='p-2'>
        <span>
          <i className='fas fa-search'></i>
          <span className='d-none d-sm-inline'> SEARCH</span>
        </span>
      </Button>
    </Form>
  );
};

export default SearchBar;
