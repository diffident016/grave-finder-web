import { format, isValid } from "date-fns";
import React, { useMemo, useReducer } from "react";
import { show } from "../../states/alerts";
import { useDispatch } from "react-redux";
import { updateRecord } from "../../api/Services";

function UpdateForm({ record, close, slots }) {
  const dispatch = useDispatch();

  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      Name: "",
      Born: "",
      Died: "",
      block_name: "",
      lot_no: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    var isValid = false;

    Object.keys(form).map((key) => {
      if (form[key] != "") {
        isValid = true;
      }
    });

    if (!isValid) {
      dispatch(
        show({
          type: "info",
          message: "There was nothing to change.",
          duration: 3000,
          show: true,
        })
      );
      return;
    }

    const newForm = {
      Name: form.Name || record["Name"],
      Born: form.Born || record["Born"],
      Died: form.Died || record["Died"],
      block_name: form.block_name || record["block_name"],
      lot_no: form.lot_no || record["lot_no"],
    };

    updateRecord(record["id"], newForm)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Record updated successfully.",
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
  };

  const blocks = useMemo(() => {
    if (slots["blocks"] < 1) return [];
    return Object.keys(slots["blocks"]);
  }, [slots["blocks"]]);

  const lots = useMemo(() => {
    if (slots["blocks"] < 1) return [];

    var temp = {};

    Object.keys(slots["blocks"]).map((key) => {
      temp[key] = slots["blocks"][key].length;
    });

    return temp[form.block_name || record["block_name"]];
  }, [blocks, form.block_name]);

  return (
    <div>
      <div className="h-full flex flex-col w-full p-4">
        <h1 className="font-lato-bold text-2xl">Edit Record</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full w-[400px] py-4"
        >
          <div className="flex flex-col">
            <label className="py-1 text-base font-lato-bold">Corpse Name</label>
            <input
              type="text"
              placeholder={record["Name"]}
              value={form.Name}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
              onChange={(e) => {
                updateForm({ Name: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col flex-1">
              <label className="py-1 text-base font-lato-bold">Born</label>
              <input
                type="date"
                max={format(Date.now(), "yyyy-MM-dd")}
                value={
                  form.Born ||
                  (isValid(Date.parse(record["Born"]))
                    ? format(record["Born"], "yyyy-MM-dd")
                    : "")
                }
                className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                onChange={(e) => {
                  updateForm({ Born: e.target.value });
                }}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="py-1 text-base font-lato-bold">Died</label>
              <input
                type="date"
                disabled={!form.Born && !isValid(Date.parse(record["Born"]))}
                min={
                  form.Born
                    ? format(form.Born, "yyyy-MM-dd")
                    : isValid(Date.parse(record["Born"]))
                    ? format(record["Born"], "yyyy-MM-dd")
                    : ""
                }
                max={format(Date.now(), "yyyy-MM-dd")}
                value={
                  form.Died ||
                  (isValid(Date.parse(record["Died"]))
                    ? format(record["Died"], "yyyy-MM-dd")
                    : "")
                }
                className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                onChange={(e) => {
                  updateForm({ Died: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col flex-1">
            <label className="py-1 text-base font-lato-bold">Block Name</label>
            <select
              onChange={(e) => {
                updateForm({
                  lot_no: "",
                  block_name: e.target.value,
                });
              }}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
            >
              {blocks.map((item, i) => (
                <option
                  selected={record["block_name"] == item}
                  id={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="py-1 text-base font-lato-bold">Lot No.</label>
            <input
              type="number"
              max={lots}
              min={1}
              placeholder={record["lot_no"]}
              value={form.lot_no}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
              onChange={(e) => {
                updateForm({ lot_no: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-row gap-2 pt-8">
            <button
              type="submit"
              className=" h-10 border border-transparent flex-1 rounded-lg font-lato-bold bg-[#4F73DF] text-white"
            >
              Save
            </button>
            <button
              type="reset"
              onClick={() => {
                //setShowInfo(false);
                close();
              }}
              className="h-10 border border-[#555C68]/40 flex-1 rounded-lg font-lato-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateForm;
