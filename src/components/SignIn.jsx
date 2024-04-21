import React, { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { CircularProgress } from "@mui/material";

function SignIn({ setScreen }) {
  const [onLogin, setLogin] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [onReset, setOnReset] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      email: "",
      password: "",
      error: "",
    }
  );

  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();

    setLogin(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (e) {
      console.log(e);
      setLogin(false);
      updateForm({ error: "Invalid email or password." });
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    setOnReset(true);
    setError("");

    resetPassword(form.email)
      .then((_) => {
        setOnReset(false);
        setSent(true);
      })
      .catch((err) => {
        setOnReset(false);
        setError("Error password reset.");
      });
  };

  return (
    <div className="bg-white h-[450px] w-[400px] rounded-lg shadow-sm">
      {forgot ? (
        sent ? (
          <div className="flex flex-col items-center rounded-lg shadow-sm pt-10 w-[450px] h-[400px] justify-center px-8">
            <h1 className="font-lato text-[#1F2F3D] text-center">
              An email has been sent to you with instruction to reset your
              password.
            </h1>
            <button
              disabled={onReset}
              onClick={() => {
                setForgot(false);
                setSent(false);
              }}
              className="mt-8 flex w-full h-10 bg-[#4F73DF] rounded-lg justify-center items-center"
            >
              <p className="text-white text-sm">Back to Login</p>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center h-full justify-center rounded-lg shadow-sm pt-10 w-[450px]">
            <h1 className="font-lato-bold text-2xl text-[#1F2F3D]">
              Reset Password
            </h1>
            <p className="font-lato py-4">
              Enter your email to reset you password.
            </p>
            <div className="z-10 pt-4 flex flex-col w-[500px] h-full items-center">
              <form
                onSubmit={handleReset}
                className="flex flex-col z-10 w-full px-2 py-2 font-lato-bold text-[#1F2F3D]"
              >
                <label className="py-2 text-sm">Email Address</label>
                <input
                  type="text"
                  value={form.email}
                  className="px-2 border font-roboto text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg"
                  name="username"
                  pattern="([A-Za-z0-9][._]?)+[A-Za-z0-9]@[A-Za-z0-9]+(\.?[A-Za-z0-9]){2}\.(com?|net|org)+(\.[A-Za-z0-9]{2,4})?"
                  title="Please enter a valid email"
                  required={true}
                  onChange={(e) => {
                    updateForm({ email: e.target.value });
                  }}
                />

                <button
                  disabled={onReset}
                  type="submit"
                  className="mt-8 flex w-full h-10 bg-[#4F73DF] rounded-lg justify-center items-center"
                >
                  {onReset ? (
                    <div className="flex flex-row items-center gap-4 text-white">
                      <CircularProgress size="18px" color="inherit" />
                      <p className=" text-sm">Loading, please wait...</p>
                    </div>
                  ) : (
                    <p className="text-sm text-white">Continue</p>
                  )}
                </button>
                <button
                  onClick={() => {
                    setForgot(false);
                  }}
                  className="rounded-lg border text-sm h-10 mt-2"
                >
                  Cancel
                </button>
                <p
                  className={`${
                    error ? "opacity-100" : "opacity-0"
                  } p-2 h-4 text-xs font-bold text-[#E8090C]`}
                >
                  {error}
                </p>
              </form>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col px-4 py-8 items-center">
          <h1 className="font-lato-bold text-3xl">Welcome!</h1>
          <p className="font-lato py-2">
            Enter your email and password to Sign In.
          </p>
          <form
            onSubmit={handleSignIn}
            className="flex flex-col z-10 w-[350px] py-2 font-lato-bold"
          >
            <label className="py-1 text-sm">Email Address</label>
            <input
              type="text"
              value={form.email}
              className="px-2 border font-roboto text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg"
              name="username"
              pattern="([A-Za-z0-9][._]?)+[A-Za-z0-9]@[A-Za-z0-9]+(\.?[A-Za-z0-9]){2}\.(com?|net|org)+(\.[A-Za-z0-9]{2,4})?"
              title="Please enter a valid email"
              required={true}
              onChange={(e) => {
                updateForm({ email: e.target.value });
              }}
            />
            <label className="pt-2 py-1 text-sm">Password</label>
            <input
              type="password"
              value={form.password}
              className="px-2 border text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg"
              name="username"
              required={true}
              onChange={(e) => {
                updateForm({ password: e.target.value });
              }}
            />
            <p
              onClick={() => {
                setForgot(true);
              }}
              className="cursor-pointer self-start pt-3 text-sm"
            >
              Forgot Password?
            </p>
            <button
              onClick={() => {
                navigate("/");
              }}
              type="submit"
              className="mt-4 flex w-full h-10 bg-[#4F73DF] rounded-lg justify-center items-center"
            >
              {onLogin ? (
                <div className="flex flex-row items-center gap-4 text-white ">
                  <CircularProgress size="18px" color="inherit" />
                  <p className="text-sm">Logging in, please wait...</p>
                </div>
              ) : (
                <p className="text-white">Sign In</p>
              )}
            </button>
            <p
              className={`${
                form.error ? "opacity-100" : "opacity-0"
              } p-2 h-4 text-xs font-bold text-[#E8090C]`}
            >
              {form.error}
            </p>
            <label className="h-[1px] border-b border-[#555C68]/40 mt-4" />
            <p
              onClick={() => {
                setScreen(1);
              }}
              className="text-center py-3 text-[#4F73DF] cursor-pointer select-none"
            >
              Create an account!
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default SignIn;
