import React, { useMemo } from "react";
import DataTable from "react-data-table-component";

function Records() {
  const columns = useMemo(() => [
    {
      name: "No.",
      selector: (row) => row.no,
      width: "60px",
    },
    {
      name: "Name of the Deceased",
      selector: (row) => row.category_name,
      width: "350px",
    },
    {
      name: "Born",
      selector: (row) => row.category_name,
      width: "160px",
    },
    {
      name: "Died",
      selector: (row) => row.category_name,
      width: "160px",
    },
    {
      name: "Street",
      selector: (row) => row.category_name,
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

export default Records;
