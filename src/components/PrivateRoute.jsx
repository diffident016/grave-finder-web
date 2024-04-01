import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Loader from "./Loader";
import AuthPage from "../pages/AuthPage";

function PrivateRoute() {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();

  const [isLoading, setLoading] = useState(true);

  if (currentUser != null) {
    if (profile.userId == null || profile.userId != currentUser.uid) {
      //getUserProfile();
    }

    return (
      <>
        {pathname === "/" ? (
          isLoading ? (
            <Loader message="Loading, please wait..." />
          ) : (
            <Homepage userType={profile.userType} />
          )
        ) : (
          <Navigate to="/" />
        )}
      </>
    );
  }

  return <AuthPage />;
}

export default PrivateRoute;
