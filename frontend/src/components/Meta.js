import React from "react";
import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "iBuyTech | Latest tech at the lowest prices",
  description: "iBuyTech - the latest tech at the lowest prices",
  keywords: "electronics, tech, cheap tech, cheap electronics",
};

export default Meta;
