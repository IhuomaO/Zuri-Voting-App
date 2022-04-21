import React, { useContext, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { IndigoVotingContext } from "context/IndigoVotingContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { currentAccount } = useContext(IndigoVotingContext);
  const loggedInUser = useState(() => localStorage.getItem("account"));

  return (
    <Route
      {...rest}
      render={(props) =>
        loggedInUser.length > 0 && loggedInUser !== null ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default PrivateRoute;
