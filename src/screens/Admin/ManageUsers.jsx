import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import data from "../../assets/data/sample.json";
import {
  TrashIcon,
  PlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { getUserById } from "../../api/Services";
import UpdateUser from "./UpdateUser";

function ManageUsers({ users }) {
  const [edit, setEdit] = useState(false);

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
          </div>
        );
      },
      width: "180px",
    },
  ]);

  return edit ? (
    <UpdateUser
      user={edit}
      close={() => {
        setEdit(null);
      }}
    />
  ) : (
    <div className="w-full h-full flex flex-col p-4 gap-4 overflow-hidden">
      <div className="w-full h-full flex flex-col  bg-white border rounded-lg p-2">
        <div className="w-full h-16 px-4 py-4 flex flex-row justify-between items-center">
          <h1 className="font-lato-bold text-xl">List of Users</h1>
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
      </div>
    </div>
  );
}

export default ManageUsers;
