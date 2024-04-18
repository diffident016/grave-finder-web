import React, { useMemo, useReducer } from "react";
import { show } from "../../states/alerts";
import { useDispatch } from "react-redux";
import { updateUser } from "../../api/Services";

function UpdateUser({ user, close, slots }) {
  const dispatch = useDispatch();

  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      fname: "",
      lname: "",
      email: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    var isValid = false;

    Object.keys(form).map((key) => {
      if (form[key] != "") {
        isValid = true;
      }
    });

    if (!isValid) {
      dispatch(
        show({
          type: "info",
          message: "There was nothing to change.",
          duration: 3000,
          show: true,
        })
      );
      return;
    }

    const newForm = {
      fname: form.fname || user["fname"],
      lname: form.lname || user["lname"],
    };

    updateUser(user["id"], newForm)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "User info updated successfully.",
            duration: 3000,
            show: true,
          })
        );

        close();
      })
      .catch((err) => {
        dispatch(
          show({
            type: "error",
            message: "Something went wrong.",
            duration: 3000,
            show: true,
          })
        );

        console.log(err);
      });
  };

  return (
    <div>
      <div className="h-full flex flex-col w-full p-4">
        <h1 className="font-lato-bold text-2xl">Edit User</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full w-[400px] py-4"
        >
          <div className="flex flex-col">
            <label className="py-1 text-base font-lato-bold">First Name</label>
            <input
              type="text"
              placeholder={user["fname"]}
              value={form.fname}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
              onChange={(e) => {
                updateForm({ fname: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label className="py-1 text-base font-lato-bold">Last Name</label>
            <input
              type="text"
              placeholder={user["lname"]}
              value={form.lname}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
              onChange={(e) => {
                updateForm({ lname: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label className="py-1 text-base font-lato-bold">Email</label>
            <input
              type="text"
              disabled
              placeholder={user["email"]}
              value={form.email}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
              onChange={(e) => {
                updateForm({ email: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-row gap-2 pt-8">
            <button
              type="submit"
              className=" h-10 border border-transparent flex-1 rounded-lg font-lato-bold bg-[#4F73DF] text-white"
            >
              Save
            </button>
            <button
              type="reset"
              onClick={() => {
                //setShowInfo(false);
                close();
              }}
              className="h-10 border border-[#555C68]/40 flex-1 rounded-lg font-lato-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
