import React, { useEffect, useReducer } from "react";
import { getTransactionNo } from "../../api/Services";
import { format } from "date-fns";

function ReservationForm({ user, showReserve, showSubmit }) {
  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      firstname: "",
      lastname: "",
      Name: "",
      Born: "",
      Died: "",
      transaction: "",
      reservedBy: `${user["fname"]} ${user["lname"]}`,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    showSubmit(form);
    showReserve(false);
  };

  useEffect(() => {
    getTransaction();
  }, []);

  const getTransaction = async () => {
    const no = await getTransactionNo();
    updateForm({ transaction: no });
  };

  return (
    <div>
      <div className="h-full flex flex-col w-full p-4">
        <h1 className="font-lato-bold text-2xl">Reservation</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full w-[400px] py-4"
        >
          <div className="flex flex-col">
            <label className="py-1 text-base font-lato-bold">
              Transaction No.
            </label>
            <input
              disabled
              placeholder={form.transaction}
              type="text"
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
              required={true}
            />
          </div>
          <div className="flex flex-col">
            <label className="py-1 text-base font-lato-bold">
              Corpse Last Name
            </label>
            <input
              type="text"
              value={form.lastname}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
              required={true}
              onChange={(e) => {
                updateForm({ lastname: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col">
            <label className="py-1 text-base font-lato-bold">
              Corpse First Name
            </label>
            <input
              type="text"
              value={form.firstname}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
              required={true}
              onChange={(e) => {
                updateForm({ firstname: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex flex-col flex-1">
              <label className="py-1 text-base font-lato-bold">Born</label>
              <input
                type="date"
                value={form.Born}
                max={format(Date.now(), "yyyy-MM-dd")}
                className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                required={true}
                onChange={(e) => {
                  updateForm({ Born: e.target.value });
                }}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="py-1 text-base font-lato-bold">Died</label>
              <input
                type="date"
                value={form.Died}
                disabled={!form.Born}
                min={form.Born ? format(form.Born, "yyyy-MM-dd") : null}
                max={format(Date.now(), "yyyy-MM-dd")}
                className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
                required={true}
                onChange={(e) => {
                  updateForm({ Died: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="py-1 text-base font-lato-bold">User</label>
            <input
              disabled
              type="text"
              placeholder={`${user["fname"]} ${user["lname"]}`}
              className="px-2 border text-[#555C68] border-[#555C68]/40 h-9 rounded-lg focus:outline-none shadow-sm"
              required={true}
            />
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
                showReserve(false);
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

export default ReservationForm;
