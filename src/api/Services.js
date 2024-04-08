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

export { getUser, addUser, getSlots };
