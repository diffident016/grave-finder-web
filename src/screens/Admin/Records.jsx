import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import data from "../../assets/data/sample.json";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { show } from "../../states/alerts";

function Records({ slots }) {
  const dispatch = useDispatch();

  const columns = useMemo(() => [
    {
      name: "No.",
      selector: (row) => row.no,
      width: "60px",
    },
    {
      name: "Name of the Deceased",
      selector: (row) => row["Name"],
      width: "250px",
    },
    {
      name: "Born",
      selector: (row) => row["Born"],
      width: "150px",
    },
    {
      name: "Died",
      selector: (row) => row["Died"],
      width: "150px",
    },
    {
      name: "Street",
      selector: (row) => `${row["block_name"]} - ${row["lot_no"]}`,
      width: "200px",
    },
    {
      name: "Actions",
      cell: function (row) {
        return (
          <div
            onClick={() => {}}
            className="cursor-pointer flex flex-row w-[100px] h-full items-center text-sm gap-2"
          >
            <TrashIcon className="w-4" fontSize="inherit" />
            Delete
          </div>
        );
      },
      width: "150px",
    },
  ]);
  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4">
      <div className="w-full h-full flex flex-col  bg-white border rounded-lg p-2">
        <div className="w-full h-16 px-4 py-4 flex flex-row justify-between items-center">
          <h1 className="font-lato-bold text-xl">List of Deceased Person</h1>
          <h1
            onClick={() => {
              dispatch(
                show({
                  type: "success",
                  message: "Product added successfully.",
                  duration: 3000,
                  show: true,
                })
              );
            }}
            className="px-2 cursor-pointer flex gap-1 font-lato-bold text-sm text-white w-24 shadow-sm py-2 rounded-lg justify-center bg-[#4F73DF]"
          >
            <span>{<PlusIcon className="w-5" />}</span> New
          </h1>
        </div>
        <DataTable
          className="font-roboto  h-full overflow-hidden rounded-lg"
          columns={columns}
          data={slots["slots"]}
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
          pagination={true}
          fixedHeader
          allowOverflow
        />
      </div>
    </div>
  );
}

export default Records;
