import React from "react";
import { Navigate, Route } from "react-router-dom";

function ProtectedRoutes({ component: Component, ...restOfProps }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Navigate to="/" />
      }
    />
  );
}

export default ProtectedRoutes;