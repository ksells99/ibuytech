import React from "react";
import PropTypes from "prop-types";

// Props passed in from Product component
const Rating = ({ value, text, colour }) => {
  return (
    <div className='rating'>
      <span>
        <i
          style={{ color: colour }}
          className={
            value >= 1
              ? "fas fa-star"
              : value >= 0.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color: colour }}
          className={
            value >= 2
              ? "fas fa-star"
              : value >= 1.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color: colour }}
          className={
            value >= 3
              ? "fas fa-star"
              : value >= 2.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color: colour }}
          className={
            value >= 4
              ? "fas fa-star"
              : value >= 3.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      <span>
        <i
          style={{ color: colour }}
          className={
            value >= 5
              ? "fas fa-star"
              : value >= 4.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
      {/* Text is optional - so if text, show it */}
      <span className='ml-1'>{text && text}</span>
    </div>
  );
};

// Default props
Rating.defaultProps = {
  colour: "#f8e825",
};

Rating.propTypes = {
  value: PropTypes.number,
  text: PropTypes.string,
  colour: PropTypes.string,
};

export default Rating;
