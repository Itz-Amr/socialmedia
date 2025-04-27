// Data/Repos/users_repo.js
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import db from "../../FireBase";

export const indexUsers = async () => {
  const users = await getDocs(collection(db, "users"));
  let final = [];
  users.forEach((user) => {
    let userObj = { ...user.data(), documentId: user.id };
    final.push(userObj);
  });
  return final;
};

export const showUser = async (userId) => {
  let final = {};
  const docRef = doc(db, "users", userId);
  const userData = await getDoc(docRef);
  if (userData.exists()) {
    final = {
      name: userData.data().name,
      id: userData.id,
      imgUrl: userData.data().imgUrl,
      studiedAt: userData.data()?.studiedAt,
      marriedTo: userData.data()?.marriedTo,
      from: userData.data()?.from,
      livesIn: userData.data()?.livesIn,
    };
  } else {
    console.log("No such document!");
  }
  return final;
};

const updateUserData = async (userId, updatedData) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const updatePayload = {};
    if (updatedData.studiedAt !== undefined) {
      updatePayload.studiedAt = updatedData.studiedAt;
    }
    if (updatedData.marriedTo !== undefined) {
      updatePayload.marriedTo = updatedData.marriedTo;
    }
    if (updatedData.from !== undefined) {
      updatePayload.from = updatedData.from;
    }
    if (updatedData.livesIn !== undefined) {
      updatePayload.livesIn = updatedData.livesIn;
    }
    await updateDoc(userDocRef, updatePayload);
    console.log("User data updated successfully for user:", userId);
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

export const usersRepo = {
  getAllUsers: async () => {
    return await indexUsers();
  },
  getUserData: async (userId) => {
    return await showUser(userId);
  },
  updateUserData: updateUserData, // ADDED THIS FUNCTION TO THE EXPORTS
};
