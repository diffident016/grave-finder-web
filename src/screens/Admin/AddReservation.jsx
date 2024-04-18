import { format, isValid } from "date-fns";
import React, { useMemo, useReducer, useState } from "react";
import { show } from "../../states/alerts";
import { useDispatch } from "react-redux";
import { reservedLot, updateRecord } from "../../api/Services";

function AddReservation({ close, slots }) {
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

    var available = slots["groupSlots"]["Available"];

    const docId = available.filter((slot) => {
      var block_name = slot["block_name"]
        .toLowerCase()
        .indexOf(form.block_name.toLowerCase());
      var lot_no = slot["lot_no"]
        .toString()
        .toLowerCase()
        .indexOf(form.lot_no.toLowerCase());

      return block_name !== -1 && lot_no !== -1;
    });

    if (docId.length < 1) {
      dispatch(
        show({
          type: "error",
          message: "Something went wrong.",
          duration: 3000,
          show: true,
        })
      );

      return;
    }

    reservedLot(docId[0]["id"], form)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Lot was reserved successfully.",
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
    if (slots["groupSlots"]["Available"] < 1) return [];

    const blk = slots["groupSlots"]["Available"].reduce((group, slot) => {
      const { block_name } = slot;
      group[block_name] = group[block_name] ?? [];
      group[block_name].push(slot);
      return group;
    }, {});

    return Object.keys(blk);
  }, [slots["blocks"]]);

  const lots = useMemo(() => {
    if (slots["groupSlots"]["Available"] < 1) return [];

    if (form.block_name == "") return [];

    const blk = slots["groupSlots"]["Available"].reduce((group, slot) => {
      const { block_name } = slot;
      group[block_name] = group[block_name] ?? [];
      group[block_name].push(slot);
      return group;
    }, {});

    var temp = {};

    Object.keys(blk).map((key) => {
      temp[key] = blk[key].map((item) => item["lot_no"]);
    });

    return temp[form.block_name];
  }, [blocks, form["block_name"]]);

  return (
    <div>
      <div className="h-full flex flex-col w-full p-4">
        <h1 className="font-lato-bold text-2xl">Reservation</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full w-[400px] py-4"
        >
          <div className="flex flex-col">
            <label className="py-1 text-base font-lato-bold">Corpse Name</label>
            <input
              type="text"
              required
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
                required
                value={form.Born}
                max={format(Date.now(), "yyyy-MM-dd")}
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
                required
                value={form.Died}
                disabled={!form.Born}
                min={form.Born ? format(form.Born, "yyyy-MM-dd") : null}
                max={format(Date.now(), "yyyy-MM-dd")}
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
              required
              onChange={(e) => {
                updateForm({
                  lot_no: "",
                  block_name: e.target.value,
                });
              }}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
            >
              {blocks.map((item, i) => (
                <option id={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label className="py-1 text-base font-lato-bold">Lot No.</label>
            <select
              required
              onChange={(e) => {
                updateForm({
                  lot_no: e.target.value,
                });
              }}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
            >
              {lots.map((item, i) => (
                <option id={item} value={item}>
                  {`Lot ${item}`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row gap-2 pt-8">
            <button
              type="submit"
              className=" h-10 border border-transparent flex-1 rounded-lg font-lato-bold bg-[#4F73DF] text-white"
            >
              Submit
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

export default AddReservation;
