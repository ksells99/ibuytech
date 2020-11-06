import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: "75px",
        height: "75px",
        margin: "20px auto",
        display: "block",
        borderWidth: "5px",
      }}
    >
      <span className='sr-only'>Loading...</span>
    </Spinner>
  );
};

export default Loading;
