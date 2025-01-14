/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import PropType from "prop-types";
import React from "react";
import { Route } from "react-router-dom";

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    component={(props) => {
      return (
        <main className="content">
          <Component {...props} />
        </main>
      );
    }}
  />
);

PublicRoute.propTypes = {
  component: PropType.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  rest: PropType.any,
};

export default PublicRoute;
