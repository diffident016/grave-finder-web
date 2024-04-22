import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import data from "../../assets/data/sample.json";
import {
  TrashIcon,
  PlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { deleteUserAccount, getUserById, pingServer } from "../../api/Services";
import UpdateUser from "./UpdateUser";
import PopupDialog from "../../components/PopupDialog";
import { show } from "../../states/alerts";
import { useDispatch } from "react-redux";
import { Alert, CircularProgress } from "@mui/material";

function ManageUsers({ users }) {
  const [edit, setEdit] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const [banner, setBanner] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const columns = useMemo(() => [
    {
      name: "No.",
      selector: (row) => row.no,
      width: "60px",
    },
    {
      name: "Custom Users",
      selector: (row) => `${row["fname"]} ${row["lname"]}`,
      width: "250px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      width: "300px",
    },
    {
      name: "Actions",
      cell: function (row) {
        return (
          <div className="flex flex-row w-full items-center">
            <div
              onClick={() => {
                setEdit(row);
              }}
              className="cursor-pointer flex-1 flex flex-row h-full items-center text-sm gap-1"
            >
              <PencilSquareIcon className="w-4" fontSize="inherit" />
              Edit
            </div>
            <div
              onClick={() => {
                setShowDialog(row);
              }}
              className="cursor-pointer flex-1 flex flex-row h-full items-center text-sm gap-1"
            >
              <TrashIcon className="w-4" fontSize="inherit" />
              Delete
            </div>
          </div>
        );
      },
      width: "180px",
    },
  ]);

  const handleDelete = async (user) => {
    setStatus("Bumping admin server, please wait...");
    setLoading(true);
    pingServer()
      .then((res) => res.json())
      .then((val) => {
        if (!val) {
          return setTimeout(() => {
            handleDelete(user);
          }, 5000);
        }
        setStatus("Deleting user, please wait...");
        deleteUserAccount({ uid: user.id })
          .then((_) => {
            setLoading(false);
            dispatch(
              show({
                type: "success",
                message: "User has been deleted successfully.",
                duration: 3000,
                show: true,
              })
            );
          })
          .catch((err) => {
            setLoading(false);
            dispatch(
              show({
                type: "error",
                message: "Something went wrong.",
                duration: 3000,
                show: true,
              })
            );
          });
      })
      .catch((err) => {
        console.log(err);
        setTimeout(() => {
          handleDelete(user);
        }, 5000);
      });
  };

  return edit ? (
    <UpdateUser
      user={edit}
      close={() => {
        setEdit(null);
      }}
    />
  ) : (
    <div className="relative w-full h-full flex flex-col p-4 gap-4 overflow-hidden">
      {loading && (
        <div className="z-10 absolute w-full h-full flex flex-col items-center justify-center bg-white/50 text-[#4F73DF]">
          <CircularProgress size={28} color="inherit" />
          <p className="py-4 font-lato-bold text-sm">{status}</p>
        </div>
      )}
      <div className="w-full h-full flex flex-col  bg-white border rounded-lg p-2">
        <div className="w-full h-16 px-4 py-4 flex flex-row justify-between items-center">
          <h1 className="font-lato-bold text-xl">List of Users</h1>
          {banner && (
            <Alert
              sx={{ width: "420px" }}
              severity="info"
              onClose={() => {
                setBanner(false);
              }}
            >
              Note: Deleting user may takes time to process.
            </Alert>
          )}
        </div>

        <DataTable
          className="font-roboto rounded-md h-full overflow-hidden"
          columns={columns}
          data={users["users"]}
          customStyles={{
            rows: {
              style: {
                color: "#607d8b",
                "font-family": "Lato",
                "font-size": "14px",
              },
            },
            headCells: {
              style: {
                color: "#607d8b",
                "font-family": "Lato-Bold",
                "font-size": "14px",
                "font-weight": "bold",
              },
            },
          }}
          persistTableHead
          pagination
          fixedHeader
          allowOverflow
        />
        <PopupDialog
          show={!!showDialog}
          close={() => {
            setShowDialog(null);
          }}
          title="Delete User"
          content="Are you sure you want to delete this user?"
          action1={() => {
            handleDelete(showDialog);
            setShowDialog(null);
          }}
          action2={() => {
            setShowDialog(null);
          }}
        />
      </div>
    </div>
  );
}

export default ManageUsers;
