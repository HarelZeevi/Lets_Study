import React, {useEffect} from "react";
import { useNavigate, Route } from "react-router-dom";

function ProtectedRoutes({ component: Component, ...restOfProps }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  let navigate = useNavigate();

  useEffect(() => {
    
    if (isAuthenticated == "false")
        return navigate("/");
 },[isAuthenticated]);
  return (
    // <Route
    //   {...restOfProps}
    //   render={(props) =>
    //     isAuthenticated == "true" ? <Component {...props} /> : <Navigate to="/" />
    //   }
    // />
    <div>Can't access this page !</div>
  );
}

export default ProtectedRoutes;