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

import { db, storage, auth } from "../../firebase";
import { format } from "date-fns";

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
};
