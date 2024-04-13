import React, { useMemo, useReducer, useState } from "react";
import DataTable from "react-data-table-component";
import { TrashIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { Backdrop } from "@mui/material";
import { format, isValid } from "date-fns";
import AddReservation from "./AddReservation";
import { show } from "../../states/alerts";
import { useDispatch } from "react-redux";
import { approveReservation, deleteReservation } from "../../api/Services";

function Reservation({ slots }) {
  const [searchItems, setSearchItems] = useState(null);
  const [query, setQuery] = useState("");
  const [isAdd, setAdd] = useState(false);
  const [view, setView] = useState(null);

  const dispatch = useDispatch();

  const columns = useMemo(() => [
    {
      name: "Lot #",
      selector: (row) => row.no,
      width: "80px",
    },
    {
      name: "Name of the Deceased",
      selector: (row) => row.Name,
      width: "250px",
    },
    {
      name: "Born",
      selector: (row) =>
        !isValid(Date.parse(row.Born)) ? "" : format(row.Born, "	MMMM dd, yyyy"),
      width: "150px",
    },
    {
      name: "Died",
      selector: (row) =>
        !isValid(Date.parse(row.Died)) ? "" : format(row.Died, "	MMMM dd, yyyy"),
      width: "150px",
    },
    {
      name: "Block Name",
      selector: (row) => row["block_name"],
      width: "200px",
    },
    {
      name: "Actions",
      cell: function (row) {
        return (
          <div className="flex flex-row w-full items-center">
            <div
              onClick={() => {
                setView(row);
              }}
              className="cursor-pointer flex-1 flex flex-row h-full items-center text-sm gap-1"
            >
              <DocumentIcon className="w-4" fontSize="inherit" />
              View
            </div>
            <div
              onClick={() => {
                handleDelete(row.id);
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

  const handleApprove = () => {
    approveReservation(view["id"])
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Reservation has been approved.",
            duration: 3000,
            show: true,
          })
        );

        setView(null);
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
        setView(null);
        console.log(err);
      });
  };

  const handleDelete = (id) => {
    deleteReservation(id)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Reservation has been deleted.",
            duration: 3000,
            show: true,
          })
        );

        setView(null);
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
        setView(null);
        console.log(err);
      });
  };

  const search = (query) => {
    var newSlots = slots["groupSlots"]["Reserved"];

    newSlots = newSlots.filter((slot) => {
      var name = slot["Name"].toLowerCase().indexOf(query.toLowerCase());
      var street = `${slot["block_name"]} ${slot["lot_no"]}`
        .toLowerCase()
        .indexOf(query.toLowerCase());

      return name !== -1 || street !== -1;
    });

    return newSlots;
  };

  return isAdd ? (
    <AddReservation
      slots={slots}
      close={() => {
        setAdd(false);
      }}
    />
  ) : (
    <div className="w-full h-full p-4 overflow-hidden flex flex-col gap-4">
      <div className="w-full h-full flex flex-col bg-white border rounded-lg p-4">
        <div className="w-full flex flex-col h-20 gap-2">
          <div className="w-full flex flex-row justify-between items-center h-12">
            <h1 className="font-lato-bold text-xl">Reservations</h1>
          </div>
          <div className="flex flex-row justify-between h-12 items-center">
            <div className="flex flex-row w-60 items-center gap-1">
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
            <h1
              onClick={() => {
                setAdd(true);
              }}
              className="px-2 cursor-pointer flex gap-1 font-lato-bold text-sm text-white shadow-sm py-2 rounded-lg justify-center bg-[#4F73DF]"
            >
              <span>{<PlusIcon className="w-5" />}</span> Add Reservation
            </h1>
          </div>
        </div>
        <DataTable
          className="font-roboto rounded-md h-full overflow-hidden"
          columns={columns}
          data={searchItems || slots["groupSlots"]["Reserved"]}
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={view}
        >
          {view && (
            <div className="w-[350px] h-[280px] bg-white rounded-lg flex flex-col p-4 text-[#555C68]">
              <div className="flex flex-row justify-between items-center">
                <h1 className="font-lato-bold text-lg">Reservation Details</h1>
                <XMarkIcon
                  onClick={() => {
                    setView(null);
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
              <div className="w-full flex flex-col gap-1 py-2 px-1">
                <div className="w-full flex flex-row gap-2">
                  <p className="font-lato-bold text-base">Block Name:</p>
                  <p>{view["block_name"]}</p>
                </div>
                <div className="w-full flex flex-row gap-2">
                  <p className="font-lato-bold text-base">Lot No:</p>
                  <p>{view["lot_no"]}</p>
                </div>
                <div className="w-full flex flex-row gap-2">
                  <p className="font-lato-bold text-base">Lot Size:</p>
                  <p>{view["Lot Size"]}</p>
                </div>
                <div className="w-full flex flex-row gap-2">
                  <p className="font-lato-bold text-base">Price Per SQM:</p>
                  <p>&#8369;{view["Price Per SQM"]}</p>
                </div>
                <div className="w-full flex flex-row gap-2">
                  <p className="font-lato-bold text-base">Whole Price:</p>
                  <p>&#8369;{view["Whole Price"]}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleApprove();
                }}
                className="mt-4 h-10 border border-transparent rounded-lg font-lato-bold bg-[#4F73DF] text-white"
              >
                Approve Reservation
              </button>
            </div>
          )}
        </Backdrop>
      </div>
    </div>
  );
}

export default Reservation;
