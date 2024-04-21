import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { Alert, Box, CircularProgress } from "@mui/material";
import Loader from "./Loader";

function VerifyEmail({ currentUser, sendVerification, logout }) {
  const navigate = useNavigate();
  const [isSent, setSent] = useState(false);
  const [count, setCount] = useState(60);
  const [showBanner, setBanner] = useState(false);
  const [load, setLoad] = useState(true);
  var timer,
    c = 60;

  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (currentUser.emailVerified) {
      return navigate(0);
    }
    if (isSent) return;
    sendEmail();
  }, []);

  const sendEmail = async () => {
    if (!isSent) {
      await sendVerification(currentUser);
      setSent(true);
      timer = setInterval(function () {
        if (c == 1) {
          clearInterval(timer);
          setSent(false);
          setBanner(true);
        }
        c = c - 1;
        setCount(c);
      }, 1000);
    }
  };

  return load ? (
    <Loader message="Loading, please wait..." />
  ) : (
    <div className="w-full h-screen flex items-center justify-center font-lato text-[#1F2F3D] flex-col gap-2">
      {showBanner && (
        <Alert
          sx={{ width: "450px" }}
          severity="info"
          onClose={() => {
            setBanner(false);
          }}
        >
          Reload page when you already verified your email.
        </Alert>
      )}
      <div className="w-[450px] h-[400px] bg-white border shadow-sm rounded-lg flex flex-col py-4 px-8">
        <div className="flex flex-row  items-center gap-2 py-2 ml-[-8px]">
          <img src={logo} className="w-20 h-20" />
          <h1 className="font-lato-bold text-2xl">GraveFinder</h1>
        </div>
        <h1 className="font-lato-bold text-lg pb-4 pt-2">
          Verify your email address
        </h1>
        <p className="p">
          To start using GraveFinder, confirm your email address with the email
          we sent to:
        </p>
        <p className="font-lato-bold py-2">{currentUser.email}</p>
        <button
          disabled={isSent}
          onClick={() => {
            sendEmail();
          }}
          className="disabled:opacity-80 relative w-full h-10 rounded-lg my-4 text-white font-lato bg-[#4F73DF] flex flex-row items-center justify-center"
        >
          <p className="text-center">Resend email</p>
          {isSent && (
            <div className="px-2 absolute right-0 h-full flex items-center opacity-100">
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={100 - (count / 60) * 100}
                  color="inherit"
                  size={"24px"}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p className="text-xs">{count}</p>
                </Box>
              </Box>
            </div>
          )}
        </button>
        <p className="text-sm py-4">
          Login another account?{" "}
          <span
            onClick={() => {
              logout();
            }}
            className="font-lato-bold text-[#4F73DF] cursor-pointer"
          >
            {" "}
            Logout
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
