import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import data from "../../assets/data/sample.json";

function Records() {
  const columns = useMemo(() => [
    {
      name: "No.",
      selector: (row) => row.no,
      width: "60px",
    },
    {
      name: "Name of the Deceased",
      selector: (row) => row.name,
      width: "350px",
    },
    {
      name: "Born",
      selector: (row) => row.born,
      width: "160px",
    },
    {
      name: "Died",
      selector: (row) => row.died,
      width: "160px",
    },
    {
      name: "Street",
      selector: (row) => row.street,
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
  return (
    <div className="w-full flex flex-col p-4 gap-4">
      <div className="w-full bg-white border rounded-lg px-4 py-4 flex flex-row justify-between items-center">
        <h1 className="font-lato-bold text-xl">List of Deceased Person</h1>
      </div>
      <div className="bg-white rounded-lg border">
        <DataTable
          className="font-roboto rounded-md h-full overflow-hidden"
          columns={columns}
          data={data["dummy"]}
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

export default Records;
