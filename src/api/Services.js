import {
  doc,
  collection,
  setDoc,
  addDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  getDocs,
  where,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase";
import { format } from "date-fns";

const BASEURL = import.meta.env.VITE_BASE_URL;

const getUser = (userId) => {
  return getDoc(doc(db, "Users", userId));
};

const addUser = (userId, user) => {
  return setDoc(doc(db, "Users", userId), {
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    id: userId,
    email: user.email,
    createdAt: Timestamp.now(),
  });
};

const getSlots = () => {
  const slotsRef = collection(db, "Slots");

  return slotsRef;
};

const getUsers = () => {
  const userRef = collection(db, "Users");

  return userRef;
};

const updateUser = (docId, form) => {
  const docRef = doc(db, "Users", docId);

  return updateDoc(docRef, {
    fname: form.fname,
    lname: form.lname,
    updatedAt: Timestamp.now(),
  });
};

const getAvailableLots = () => {
  const lotsRef = doc(db, "Available Lots", "locations");

  return lotsRef;
};

const updateAvailableLots = (form) => {
  const lotsRef = doc(db, "Available Lots", "locations");

  return updateDoc(lotsRef, form);
};

const getTransactionNo = async () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const reservationRef = collection(db, "Slots");

  return new Promise((resolve, reject) => {
    getDocs(
      query(
        reservationRef,
        where("updatedAt", ">", today),
        where("Status", "==", "Reserved")
      )
    )
      .then((val) => {
        resolve(`${format(today, "MMddyy")}-${val.size + 1}`);
      })
      .catch((e) => reject(e));
  });
};

const reservedLot = (docId, form) => {
  const docRef = doc(db, "Slots", docId);

  return Promise.all([
    updateDoc(docRef, {
      Name: form.Name,
      Status: "Reserved",
      Born: form.Born,
      Died: form.Died,
      updatedAt: Timestamp.now(),
    }),
    addReservation(form),
  ]);
};

const getUserById = (userId) => {
  getAuth()
    .getUser(userId)
    .then((val) => {
      console.log(val);
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteReservation = (docId) => {
  const docRef = doc(db, "Slots", docId);

  return updateDoc(docRef, {
    Name: null,
    Status: "Available",
    Born: null,
    Died: null,
    updatedAt: Timestamp.now(),
  });
};

const approveReservation = (docId) => {
  const docRef = doc(db, "Slots", docId);

  return updateDoc(docRef, {
    Status: "Occupied",
    updatedAt: Timestamp.now(),
  });
};

const updateRecord = (docId, form) => {
  const docRef = doc(db, "Slots", docId);

  return updateDoc(docRef, {
    Name: form.Name,
    Born: form.Born,
    Died: form.Died,
    block_name: form.block_name,
    lot_no: form.lot_no,
    updatedAt: Timestamp.now(),
  });
};

const addReservation = (form) => {
  var temp = form;
  temp["updatedAt"] = Timestamp.now();

  return setDoc(doc(collection(db, "Reservations")), temp);
};

const getReservations = () => {
  const rRef = collection(db, "Reservations");

  return rRef;
};

const deleteUserData = (id) => {
  return deleteDoc(doc(db, "Users", id));
};

const deleteUserAccount = (id) => {
  return Promise.all([
    deleteUserData(id.uid),
    fetch(`${BASEURL}/api/delete`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(id),
    }),
  ]);
};

const pingServer = async () => {
  return fetch(`${BASEURL}/ping`);
};

const updateCoor = async (docId, coor, center) => {
  const docRef = doc(db, "Slots", docId);

  return updateDoc(docRef, {
    Latitude: String(center[0]),
    Longitude: String(center[1]),
    lat_long1: String(coor[0]),
    lat_long2: String(coor[1]),
    lat_long3: String(coor[2]),
    lat_long4: String(coor[3]),
    updatedAt: Timestamp.now(),
  });
};

const addSlot = async (coor, center) => {
  const slotsRef = collection(db, "Slots");

  const slot = {
    Born: null,
    Died: null,
    Installment: null,
    "Lot Size": null,
    Name: null,
    "Price Per SQM": null,
    Status: "Draft",
    "Whole Price": null,
    block_name: null,
    capacity: null,
    lot_no: null,
    Latitude: String(center[0]),
    Longitude: String(center[1]),
    lat_long1: String(coor[0]),
    lat_long2: String(coor[1]),
    lat_long3: String(coor[2]),
    lat_long4: String(coor[3]),
    updatedAt: Timestamp.now(),
  };

  return setDoc(doc(slotsRef), slot);
};

const updateSlot = (docId, form) => {
  const docRef = doc(db, "Slots", docId);
  var temp = form;
  temp["updatedAt"] = Timestamp.now();

  return updateDoc(docRef, temp);
};

const deleteSlot = (docId) => {
  return deleteDoc(doc(db, "Slots", docId));
};

export {
  getUser,
  getUsers,
  updateUser,
  addUser,
  getSlots,
  onSnapshot,
  getTransactionNo,
  reservedLot,
  deleteReservation,
  approveReservation,
  getUserById,
  updateRecord,
  getAvailableLots,
  updateAvailableLots,
  addReservation,
  getReservations,
  deleteUserAccount,
  pingServer,
  updateCoor,
  addSlot,
  updateSlot,
  deleteSlot,
};
