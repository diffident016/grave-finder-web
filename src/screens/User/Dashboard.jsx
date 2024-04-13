import React from "react";
import data from "../../assets/data/sample.json";
import { CircularProgress } from "@mui/material";

function Dashboard({ lots }) {
  return (
    <div className="w-full h-full flex flex-col">
      {lots["fetchState"] != 1 ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <CircularProgress />
          <p className="text-base">Fetching data...</p>
        </div>
      ) : (
        <div className="w-full flex flex-col px-8 py-4">
          <div className="flex flex-row gap-4 items-center">
            <h1 className="text-2xl font-lato-bold">Available Lots</h1>
          </div>

          <div className="flex flex-row gap-8 py-4">
            <div className="w-[300px] h-[160px] bg-white rounded-md shadow-sm border-l-4 border-[#4F73DF]">
              <div className="flex flex-col h-full justify-center px-4 gap-2">
                <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                  {lots["lots"]["Mausoleum-2"]["lots"]["available"]}
                </h1>

                <h1 className="font-lato-bold text-xl">
                  {lots["lots"]["Mausoleum-2"]["name"]}
                </h1>
              </div>
            </div>
            <div className="w-[300px] h-[160px] bg-white rounded-md shadow-sm border-l-4 border-[#4F73DF]">
              <div className="flex flex-col h-full justify-center px-4 gap-2">
                <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                  {lots["lots"]["Memory-F1"]["lots"]["available"]}
                </h1>

                <h1 className="font-lato-bold text-xl">
                  {lots["lots"]["Memory-F1"]["name"]}
                </h1>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-lato-bold pt-4">Reserved Lots</h1>
          <div className="flex flex-row gap-8 py-4">
            <div className="w-[300px] h-[160px] bg-white rounded-md shadow-sm border-l-4 border-[#4F73DF]">
              <div className="flex flex-col h-full justify-center px-4 gap-2">
                <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                  {lots["lots"]["Mausoleum-2"]["lots"]["reserved"]}
                </h1>

                <h1 className="font-lato-bold text-xl">
                  {lots["lots"]["Mausoleum-2"]["name"]}
                </h1>
              </div>
            </div>
            <div className="w-[300px] h-[160px] bg-white rounded-md shadow-sm border-l-4 border-[#4F73DF]">
              <div className="flex flex-col h-full justify-center px-4 gap-2">
                <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                  {lots["lots"]["Memory-F1"]["lots"]["reserved"]}
                </h1>
                <h1 className="font-lato-bold text-xl">
                  {lots["lots"]["Memory-F1"]["name"]}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
