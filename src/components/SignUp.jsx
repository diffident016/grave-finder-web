import React, { useReducer, useState } from "react";

function SignUp({ setScreen }) {
  const [onSignup, setSignup] = useState(false);
  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      error: "",
    }
  );

  return (
    <div className="bg-white h-[520px] w-[80%] rounded-lg shadow-sm">
      <div className="flex flex-col px-4 py-6 items-center">
        <h1 className="font-lato-bold text-3xl">Welcome!</h1>
        <form className="flex flex-col z-10 w-[350px] py-2 font-lato-bold">
          <label className="py-1 text-sm">Full Name</label>
          <input
            type="text"
            value={form.name}
            className="px-2 border text-[#1F2F3D] border-[#1F2F3D] h-9 rounded-lg"
            required={true}
            onChange={(e) => {
              updateForm({ name: e.target.value });
            }}
          />
          <label className="py-1 text-sm">Email Address</label>
          <input
            type="text"
            value={form.email}
            className="px-2 border font-roboto text-[#1F2F3D] border-[#1F2F3D] h-9 rounded-lg"
            name="username"
            pattern="([A-Za-z0-9][._]?)+[A-Za-z0-9]@[A-Za-z0-9]+(\.?[A-Za-z0-9]){2}\.(com?|net|org)+(\.[A-Za-z0-9]{2,4})?"
            title="Please enter a valid email"
            required={true}
            onChange={(e) => {
              updateForm({ email: e.target.value });
            }}
          />
          <label className="pt-1 py-1 text-sm">Password</label>
          <input
            type="password"
            value={form.password}
            className="px-2 border text-[#1F2F3D] border-[#1F2F3D] h-9 rounded-lg"
            required={true}
            onChange={(e) => {
              updateForm({ password: e.target.value });
            }}
          />
          <label className="pt-1 py-1 text-sm">Confirm Password</label>
          <input
            type="password"
            value={form.confirm_password}
            className="px-2 border text-[#1F2F3D] border-[#1F2F3D] h-9 rounded-lg"
            required={true}
            onChange={(e) => {
              updateForm({ confirm_password: e.target.value });
            }}
          />
          <div className="pt-3 flex flex-row items-center gap-1">
            <input type="checkbox" className="h-4 w-4 rounded-sm" />
            <p className="cursor-pointer self-start underline text-sm">
              Terms and Conditions
            </p>
          </div>

          <button
            type="submit"
            className="mt-4 flex w-full h-10 bg-[#4F73DF] rounded-lg justify-center items-center"
          >
            {onSignup ? (
              <div className="flex flex-row items-center gap-4">
                <CircularProgress size="18px" color="inherit" />
                <p className="text-white text-sm">Logging in, please wait...</p>
              </div>
            ) : (
              <p className="text-white">Sign Up</p>
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
              setScreen(0);
            }}
            className="text-center py-3 text-[#4F73DF] cursor-pointer select-none"
          >
            Already have an account?
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
