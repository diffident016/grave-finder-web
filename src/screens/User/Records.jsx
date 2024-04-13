import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import data from "../../assets/data/sample.json";

function Records({ slots }) {
  const [searchItems, setSearchItems] = useState(null);
  const [query, setQuery] = useState("");

  const columns = useMemo(() => [
    {
      name: "No.",
      selector: (row) => row.no,
      width: "60px",
    },
    {
      name: "Name of the Deceased",
      selector: (row) => row["Name"],
      width: "350px",
    },
    {
      name: "Born",
      selector: (row) => row["Born"],
      width: "160px",
    },
    {
      name: "Died",
      selector: (row) => row["Died"],
      width: "160px",
    },
    {
      name: "Street",
      selector: (row) => `${row["block_name"]} - ${row["lot_no"]}`,
      width: "300px",
    },
    // {
    //   name: "Actions",
    //   cell: function (row) {
    //     return (
    //       <div
    //         onClick={() => {}}
    //         className="cursor-pointer flex flex-row w-[100px] h-full items-center text-sm gap-2"
    //       >
    //         <Delete className="" fontSize="inherit" />
    //         Delete
    //       </div>
    //     );
    //   },
    //   width: "200px",
    // },
  ]);

  const search = (query) => {
    var newSlots = slots["groupSlots"]["Occupied"];

    newSlots = newSlots.filter((slot) => {
      var name = slot["Name"].toLowerCase().indexOf(query.toLowerCase());
      var street = `${slot["block_name"]} ${slot["lot_no"]}`
        .toLowerCase()
        .indexOf(query.toLowerCase());

      return name !== -1 || street !== -1;
    });

    return newSlots;
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-4">
      <div className="w-full h-full flex flex-col  bg-white border rounded-lg p-2">
        <div className="w-full h-16 px-4 py-4 flex flex-row justify-between items-center">
          <h1 className="font-lato-bold text-xl">List of Deceased Person</h1>
        </div>
        <div className="flex flex-row w-full items-center gap-1 px-4">
          <input
            value={query}
            onChange={(e) => {
              const query = e.target.value;
              setQuery(query);
              setSearchItems(search(query));
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
        <DataTable
          className="font-roboto  h-full overflow-hidden rounded-lg"
          columns={columns}
          data={searchItems || slots["groupSlots"]["Occupied"]}
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
