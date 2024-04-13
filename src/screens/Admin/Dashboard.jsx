import React, { useReducer, useState } from "react";
import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { CircularProgress } from "@mui/material";
import { updateAvailableLots } from "../../api/Services";
import { show } from "../../states/alerts";
import { useDispatch } from "react-redux";

function Dashboard({ lots }) {
  const dispatch = useDispatch();

  const [update, setUpdate] = useState(false);

  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      l1A: "",
      l2A: "",
      l1R: "",
      l2R: "",
    }
  );

  const handleSave = () => {
    const newForm = {
      "Mausoleum-2": {
        lots: {
          available:
            form.l1A || lots["lots"]["Mausoleum-2"]["lots"]["available"],
          reserved: form.l1R || lots["lots"]["Mausoleum-2"]["lots"]["reserved"],
        },
        name: "Mausoleum-2",
      },
      "Memory-F1": {
        lots: {
          available: form.l2A || lots["lots"]["Memory-F1"]["lots"]["available"],
          reserved: form.l2R || lots["lots"]["Memory-F1"]["lots"]["reserved"],
        },
        name: "Memory-F1",
      },
    };

    updateAvailableLots(newForm)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Lots updated successfully.",
            duration: 3000,
            show: true,
          })
        );
        setUpdate(false);
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
        setUpdate(false);
      });
  };

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
            <h1
              onClick={() => {
                if (update) {
                  handleSave();
                } else {
                  setUpdate(!update);
                }
              }}
              className="flex flex-row w-[120px] items-center gap-1 font-lato-bold text-sm cursor-pointer"
            >
              {update ? (
                <PencilSquareIcon className="w-4 h-4" />
              ) : (
                <ArrowPathIcon className="w-4 h-4" />
              )}
              {update ? "Save" : "Update"}
            </h1>
          </div>

          <div className="flex flex-row gap-8 py-4">
            <div className="w-[300px] h-[160px] bg-white rounded-md shadow-sm border-l-4 border-[#4F73DF]">
              <div className="flex flex-col h-full justify-center px-4 gap-2">
                {update ? (
                  <input
                    type="number"
                    min={0}
                    placeholder={
                      lots["lots"]["Mausoleum-2"]["lots"]["available"]
                    }
                    value={form.l1A}
                    onChange={(e) => {
                      updateForm({ l1A: e.target.value });
                    }}
                    className="font-lato-bold text-4xl text-[#4F73DF] bg-slate-200 rounded-lg px-2"
                  />
                ) : (
                  <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                    {lots["lots"]["Mausoleum-2"]["lots"]["available"]}
                  </h1>
                )}
                <h1 className="font-lato-bold text-xl">
                  {lots["lots"]["Mausoleum-2"]["name"]}
                </h1>
              </div>
            </div>
            <div className="w-[300px] h-[160px] bg-white rounded-md shadow-sm border-l-4 border-[#4F73DF]">
              <div className="flex flex-col h-full justify-center px-4 gap-2">
                {update ? (
                  <input
                    type="number"
                    min={0}
                    placeholder={lots["lots"]["Memory-F1"]["lots"]["available"]}
                    value={form.l2A}
                    onChange={(e) => {
                      updateForm({ l2A: e.target.value });
                    }}
                    className="font-lato-bold text-4xl text-[#4F73DF] bg-slate-200 rounded-lg px-2"
                  />
                ) : (
                  <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                    {lots["lots"]["Memory-F1"]["lots"]["available"]}
                  </h1>
                )}
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
                {update ? (
                  <input
                    type="number"
                    min={0}
                    placeholder={
                      lots["lots"]["Mausoleum-2"]["lots"]["reserved"]
                    }
                    value={form.l1R}
                    onChange={(e) => {
                      updateForm({ l1R: e.target.value });
                    }}
                    className="font-lato-bold text-4xl text-[#4F73DF] bg-slate-200 rounded-lg px-2"
                  />
                ) : (
                  <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                    {lots["lots"]["Mausoleum-2"]["lots"]["reserved"]}
                  </h1>
                )}
                <h1 className="font-lato-bold text-xl">
                  {lots["lots"]["Mausoleum-2"]["name"]}
                </h1>
              </div>
            </div>
            <div className="w-[300px] h-[160px] bg-white rounded-md shadow-sm border-l-4 border-[#4F73DF]">
              <div className="flex flex-col h-full justify-center px-4 gap-2">
                {update ? (
                  <input
                    type="number"
                    min={0}
                    placeholder={lots["lots"]["Memory-F1"]["lots"]["reserved"]}
                    value={form.l2R}
                    onChange={(e) => {
                      updateForm({ l2R: e.target.value });
                    }}
                    className="font-lato-bold text-4xl text-[#4F73DF] bg-slate-200 rounded-lg px-2"
                  />
                ) : (
                  <h1 className="font-lato-bold text-4xl text-[#4F73DF]">
                    {lots["lots"]["Memory-F1"]["lots"]["reserved"]}
                  </h1>
                )}
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
