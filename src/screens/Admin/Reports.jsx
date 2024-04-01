import React, { useEffect, useState } from "react";
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

function Reports() {
  const data = [
    {
      name: "Jan",
      uv: 25,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Feb",
      uv: 12,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Mar",
      uv: 16,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Apr",
      uv: 20,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "May",
      uv: 18,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Jun",
      uv: 23,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Jul",
      uv: 34,
      pv: 4300,
      amt: 2100,
    },
  ];

  return (
    <div className="w-full h-full p-4 overflow-hidden flex flex-col gap-4">
      <div className="w-full bg-white border rounded-lg px-4 py-4 flex flex-row justify-between items-center">
        <h1 className="font-lato-bold text-xl">Reports</h1>
        {/* <h1
          onClick={() => {}}
          className="px-2 cursor-pointer flex gap-1 font-lato-bold text-sm text-white w-24 shadow-sm py-2 rounded-lg justify-center bg-[#4F73DF]"
        >
          <span>{<PlusIcon className="w-5" />}</span> New
        </h1> */}
      </div>
      <div className="flex flex-col w-full h-full bg-white border rounded-lg p-4">
        <div className="h-12 w-full flex flex-row items-center">
          <h1 className="font-lato-bold">Reservations</h1>
        </div>

        <ResponsiveContainer width="100%" height="80%" className="text-sm py-2">
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
              <Label value="Months of the Year" offset={0} position="bottom" />
            </XAxis>
            <YAxis>
              <Label
                value="Reservations"
                angle={-90}
                offset={0}
                position="left"
              />
            </YAxis>

            <Line type="monotone" dataKey="uv" stroke="#4F73DF" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Reports;
