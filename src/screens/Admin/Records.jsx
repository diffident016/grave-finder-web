import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import data from "../../assets/data/sample.json";
import {
  TrashIcon,
  PlusIcon,
  PencilIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { show } from "../../states/alerts";
import UpdateForm from "./UpdateForm";
import { format, isValid } from "date-fns";
import { deleteReservation } from "../../api/Services";

function Records({ slots }) {
  const dispatch = useDispatch();

  const [edit, setEdit] = useState(null);
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
      width: "250px",
    },
    {
      name: "Born",
      selector: (row) =>
        !isValid(Date.parse(row.Born)) ? "" : format(row.Born, "MMMM dd, yyyy"),
      width: "160px",
    },
    {
      name: "Died",
      selector: (row) =>
        !isValid(Date.parse(row.Died)) ? "" : format(row.Died, "MMMM dd, yyyy"),
      width: "160px",
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
                deleteReservation(row.id)
                  .then((_) => {
                    dispatch(
                      show({
                        type: "success",
                        message: "Record was deleted successfully.",
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

  useEffect(() => {
    setSearchItems(null);
  }, [slots["slots"]]);

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

  return edit ? (
    <UpdateForm
      record={edit}
      close={() => {
        setEdit(null);
      }}
      slots={slots}
    />
  ) : (
    <div className="w-full h-full flex flex-col overflow-hidden p-4">
      <div className="w-full h-full flex flex-col  bg-white border rounded-lg p-2">
        <div className="w-full h-16 px-4 py-4 flex flex-row justify-between items-center">
          <h1 className="font-lato-bold text-xl">List of Deceased Person</h1>
          {/* <h1
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
          </h1> */}
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
