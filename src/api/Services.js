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

import { db, storage } from "../../firebase";
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

  return updateDoc(docRef, {
    Name: form.Name,
    Status: "Reserved",
    Born: form.Born,
    Died: form.Died,
    updatedAt: Timestamp.now(),
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

export {
  getUser,
  addUser,
  getSlots,
  onSnapshot,
  getTransactionNo,
  reservedLot,
  deleteReservation,
};
