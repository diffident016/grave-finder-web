import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Loader from "./Loader";
import Homepage from "../pages/Homepage";
import AdminHomepage from "../pages/AdminHomepage";
import AuthPage from "../pages/AuthPage";
import { getUser } from "../api/Services";
import VerifyEmail from "./VerifyEmail";

function PrivateRoute() {
  const { currentUser, logout, sendVerification } = useAuth();
  const { pathname } = useLocation();

  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getUserProfile = async () => {
    getUser(currentUser.uid)
      .then((value) => {
        if (value.data() != null) {
          const userProfile = value.data();
          setUser(userProfile);
          setLoading(false);
        }
      })
      .catch((err) => {
        logout();
      });
  };

  if (currentUser != null) {
    if (user?.id == null || user?.id != currentUser.uid) {
      getUserProfile();
    }

    return (
      <>
        {pathname === "/" ? (
          isLoading ? (
            <Loader message="Loading, please wait..." />
          ) : !user?.userType ? (
            !currentUser.emailVerified ? (
              <VerifyEmail
                currentUser={currentUser}
                sendVerification={sendVerification}
                logout={logout}
              />
            ) : (
              <Homepage user={user} />
            )
          ) : (
            <AdminHomepage user={user} />
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
