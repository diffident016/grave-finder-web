import React, { useMemo, useReducer, useState } from "react";
import DataTable from "react-data-table-component";
import data from "../../assets/data/sample.json";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

function Reservation() {
  const [searchItems, setSearchItems] = useState([]);
  const [query, setQuery] = useState("");
  const [isAdd, setAdd] = useState(false);

  const columns = useMemo(() => [
    {
      name: "Lot #",
      selector: (row) => row.no,
      width: "80px",
    },
    {
      name: "Name of the Deceased",
      selector: (row) => row.name,
      width: "200px",
    },
    {
      name: "Born",
      selector: (row) => row.born,
      width: "100px",
    },
    {
      name: "Died",
      selector: (row) => row.died,
      width: "100px",
    },
    {
      name: "Block Name",
      selector: (row) => row.street,
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
    <div className="w-full h-full p-4 overflow-hidden flex flex-col gap-4">
      <div className="w-full h-full flex flex-col bg-white border rounded-lg p-4">
        <div className="w-full flex flex-col h-20 gap-2">
          <div className="w-full flex flex-row justify-between items-center">
            <h1 className="font-lato-bold text-xl">Reservations</h1>
            <h1
              onClick={() => {
                setAdd(true);
              }}
              className="px-2 cursor-pointer flex gap-1 font-lato-bold text-sm text-white shadow-sm py-2 rounded-lg justify-center bg-[#4F73DF]"
            >
              <span>{<PlusIcon className="w-5" />}</span> Add Reservation
            </h1>
          </div>
          <div className="flex flex-row w-60 items-center gap-1">
            <input
              value={query}
              onChange={(e) => {
                const query = e.target.value;
                setQuery(query);
                //setSearchItems(search(query));
              }}
              className="px-2 text-sm rounded-md h-9 w-60 border focus:outline-none"
              placeholder="Search name..."
            />
            {query != "" && (
              <p
                onClick={() => {
                  setQuery("");
                }}
                className="text-sm cursor-pointer opacity-60"
              >
                clear
              </p>
            )}
          </div>
        </div>
        <DataTable
          className="font-roboto rounded-md h-full overflow-hidden"
          columns={columns}
          data={[]}
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

export default Reservation;
