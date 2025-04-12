import { doc, getDoc } from "firebase/firestore";
import db from "../../FireBase";

export const showUser = async (userId) => {
  let final = {};
  const docRef = doc(db, "users", userId);
  const userData = await getDoc(docRef);
  if (userData.exists()) {
    final = { name: userData.data().name, id: userData.id };
  } else {
    console.log("No such document!");
  }
  return final;
};
