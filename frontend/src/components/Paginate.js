import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  // Only show pagination if more than 1 page
  return (
    pages > 1 && (
      <Pagination>
        {/* Map through number of pages */}
        {[...Array(pages).keys()].map((x) => (
          //   Link to next page - if search keyword exists, link to search URL - if not, link to normal page URL. If admin user, link to admin pagelist
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/productList/page/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
