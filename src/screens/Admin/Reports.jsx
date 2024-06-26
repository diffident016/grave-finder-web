import { PrinterIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Print } from "@mui/icons-material";
import { Backdrop, CircularProgress } from "@mui/material";
import { format, getDaysInMonth, isValid } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DataTable from "react-data-table-component";

function Reports({ reservations, slots }) {
  const [header, setHeader] = useState("");
  const [filter, setFilter] = useState(0);
  const [isPrint, setPrint] = useState(false);

  const data = useMemo(() => {
    const now = new Date();
    var temp = [];
    var reports = reservations["data"];

    if (reports.length < 1) return [];

    if (filter == 0) {
      var days = now.getDate();

      const head = `1 - ${days} ${format(now, "MMMM yyyy")}`;
      setHeader(head);

      const group = reports.reduce((group, report) => {
        const { updatedAt } = report;
        group[format(updatedAt.toDate(), "MMMM yyyy dd")] =
          group[format(updatedAt.toDate(), "MMMM yyyy dd")] ?? [];
        group[format(updatedAt.toDate(), "MMMM yyyy dd")].push(report);
        return group;
      }, {});

      days = new Array(days).fill(0);
      temp = days.map((_, index) => {
        return {
          name: `${format(now, "MMM")} ${index + 1}`,
          Reservations: group[format(now, `MMMM yyyy ${index + 1}`)]
            ? group[format(now, `MMMM yyyy ${index + 1}`)].length
            : 0,
        };
      });
    } else if (filter == 1) {
      var months = now.getMonth();
      months = new Array(months + 1).fill(0);

      const head = `January - ${format(now, "MMMM yyyy")}`;
      setHeader(head);

      const group = reports.reduce((group, report) => {
        const { updatedAt } = report;
        group[format(updatedAt.toDate(), "MMM yyyy")] =
          group[format(updatedAt.toDate(), "MMM yyyy")] ?? [];
        group[format(updatedAt.toDate(), "MMM yyyy")].push(report);
        return group;
      }, {});

      temp = months.map((_, index) => {
        return {
          name: format(Date.parse(`2022-${index + 1}-01`), "MMM"),
          Reservations: group[
            format(
              Date.parse(`${now.getFullYear()}-${index + 1}-01`),
              `MMM yyyy`
            )
          ]
            ? group[
                format(
                  Date.parse(`${now.getFullYear()}-${index + 1}-01`),
                  `MMM yyyy`
                )
              ].length
            : 0,
        };
      });
    } else {
      const head = `Year ${format(now, "yyyy")}`;
      setHeader(head);

      const group = reports.reduce((group, report) => {
        const { updatedAt } = report;
        group[format(updatedAt.toDate(), "yyyy")] =
          group[format(updatedAt.toDate(), "yyyy")] ?? [];
        group[format(updatedAt.toDate(), "yyyy")].push(report);
        return group;
      }, {});

      temp = Object.keys(group).map((key, index) => {
        return {
          name: key,
          Reservations: group[key].length,
        };
      });
    }

    return temp;
  }, [filter]);

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
  ]);

  const generateReservation = (type) => {
    const doc = new jsPDF();

    if (type == 0) {
      autoTable(doc, {
        head: [["No.", "Name of Deceased", "Born", "Died", "Street"]],
        body: slots["groupSlots"]["Occupied"].map((item) => [
          item.no,
          item.Name,
          !isValid(Date.parse(item.Born))
            ? ""
            : format(item.Born, "MMMM dd, yyyy"),
          !isValid(Date.parse(item.Died))
            ? ""
            : format(item.Died, "MMMM dd, yyyy"),
          `${item["block_name"]} - ${item["lot_no"]}`,
        ]),
      });
      doc.save(`BurriedReport${format(Date.now(), "MM-dd-yyyy")}.pdf`);
    } else {
      autoTable(doc, {
        head: [
          [
            "Name of Deceased",
            "Block Name",
            "Lot No.",
            "Reserved By",
            "Reserved Date",
          ],
        ],
        body: reservations["data"].map((item) => [
          item["Name"],
          item["block_name"],
          item["lot_no"],
          item["reservedBy"],
          format(item["updatedAt"].toDate(), "MMMM dd, yyyy"),
        ]),
      });
      doc.save(`ReservationReport${format(Date.now(), "MM-dd-yyyy")}.pdf`);
    }

    setPrint(false);
  };

  return (
    <div className="w-full h-full p-4  flex flex-col gap-4 overflow-hidden">
      <div className="w-full bg-white border rounded-lg px-4 py-4 flex flex-row justify-between items-center ">
        <h1 className="font-lato-bold text-xl">Reports</h1>
      </div>

      {reservations["fetchState"] == 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <CircularProgress />
          <p className="text-base">Fetching data...</p>
        </div>
      ) : (
        <div className="flex flex-col h-full w-full overflow-auto gap-2">
          <div className="flex flex-col w-full h-[400px] bg-white border rounded-lg p-4">
            <div className="h-12 w-full flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <h1 className="font-lato-bold text-lg">Reservations</h1>
                <p className="text-sm font-light">{header}</p>
              </div>

              <div className="flex flex-row gap-4">
                <div className="flex flex-row w-[180px] h-8 border rounded-lg text-xs font-lato-bold">
                  <button
                    onClick={() => {
                      setFilter(0);
                    }}
                    className={`${
                      filter == 0 && "bg-[#4F73DF] text-white"
                    } flex-1  border-r rounded-l-lg`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => {
                      setFilter(1);
                    }}
                    className={`${
                      filter == 1 && "bg-[#4F73DF] text-white"
                    } flex-1  border-r`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => {
                      setFilter(2);
                    }}
                    className={` ${
                      filter == 2 && "bg-[#4F73DF] text-white"
                    } flex-1  border-r rounded-r-lg`}
                  >
                    Year
                  </button>
                </div>
                <button
                  onClick={() => {
                    generateReservation();
                  }}
                  title="Print reservation report"
                  className="hover:bg-[#4F73DF] hover:text-white border text-[#4F73DF]  border-[#4F73DF] rounded-lg flex items-center justify-center w-40 h-8 gap-2"
                >
                  <Print className="w-4 h-4 " fontSize="inherit" />
                  <p className="text-xs font-lato-bold">Reservation Report</p>
                </button>
              </div>
            </div>

            <div className="w-full h-[500px]">
              <ResponsiveContainer
                width="100%"
                height="90%"
                className="text-sm py-2 mt-4 h-full"
              >
                <LineChart
                  width={450}
                  height={250}
                  data={data}
                  onClick={(e) => {}}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 15,
                    bottom: 15,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <XAxis dataKey="name">
                    <Label
                      value={
                        ["Days of the Month", "Months of the Year", "Year"][
                          filter
                        ]
                      }
                      offset={0}
                      position="bottom"
                    />
                  </XAxis>
                  <YAxis>
                    <Label
                      value="Reservations"
                      angle={-90}
                      offset={0}
                      position="left"
                    />
                  </YAxis>

                  <Line
                    type="monotone"
                    dataKey="Reservations"
                    stroke="#4F73DF"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isPrint}
            >
              {isPrint && (
                <div className="w-[350px] h-[180px] bg-white/80 rounded-lg flex flex-col p-4 text-[#555C68]">
                  <div className="flex flex-row justify-between items-center">
                    <h1 className="font-lato-bold text-lg">Print Reports</h1>
                    <XMarkIcon
                      onClick={() => {
                        setPrint(false);
                      }}
                      className="w-6 h-6 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => {
                      generateReservation();
                    }}
                    className="mt-3 h-10 border rounded-lg font-lato-bold border-[#4F73DF] text-[#4F73DF]"
                  >
                    Reservation Reports
                  </button>
                  <button
                    onClick={() => {
                      generateReservation(0);
                    }}
                    className="mt-3 h-10 border rounded-lg font-lato-bold border-[#4F73DF] text-[#4F73DF]"
                  >
                    Buried Reports
                  </button>
                </div>
              )}
            </Backdrop>
          </div>
          <div className="w-full h-full flex flex-col  bg-white border rounded-lg p-2">
            <div className="w-full h-16 px-4 py-4 flex flex-row justify-between items-center">
              <h1 className="font-lato-bold text-xl">List of Buried</h1>
              <button
                onClick={() => {
                  generateReservation(0);
                }}
                title="Print reservation report"
                className="hover:bg-[#4F73DF] hover:text-white border text-[#4F73DF]  border-[#4F73DF] rounded-lg flex items-center justify-center w-40 h-8 gap-2"
              >
                <Print className="w-4 h-4 " fontSize="inherit" />
                <p className="text-xs font-lato-bold">Buried Report</p>
              </button>
            </div>

            <DataTable
              className="font-roboto  h-full overflow-hidden rounded-lg"
              columns={columns}
              data={slots["groupSlots"]["Occupied"]}
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
      )}
    </div>
  );
}

export default Reports;
