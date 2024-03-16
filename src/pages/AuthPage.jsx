import React, { useState } from "react";
import banner from "../assets/images/banner.png";
import { CircularProgress } from "@mui/material";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

function AuthPage() {
  const [index, setIndex] = useState(0);
  const screens = [
    <SignIn setScreen={setIndex} />,
    <SignUp setScreen={setIndex} />,
  ];

  return (
    <div className="w-full h-screen bg-[#f1ecec] text-[#1F2F3D]">
      <div className="w-full h-full flex flex-row items-center">
        <div className="flex-1 flex items-center justify-center">
          <img src={banner} className="w-[550px]" />
        </div>
        <div className="w-[40%] h-full flex items-center">{screens[index]}</div>
      </div>
    </div>
  );
}

export default AuthPage;
