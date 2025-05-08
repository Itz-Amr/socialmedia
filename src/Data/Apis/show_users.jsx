// Data/Repos/users_repo.js
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  deleteField,
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
      friendRequestsReceived: userData.data()?.friendRequestsReceived || {},
      friendRequestsSent: userData.data()?.friendRequestsSent || {},
      friends: userData.data()?.friends || {},
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

const sendFriendRequest = async (currentUserId, receiverId) => {
  try {
    const currentUserRef = doc(db, "users", currentUserId);
    const receiverRef = doc(db, "users", receiverId);
    const batch = writeBatch(db);

    batch.update(currentUserRef, {
      [`friendRequestsSent.${receiverId}`]: true,
    });

    batch.update(receiverRef, {
      [`friendRequestsReceived.${currentUserId}`]: true,
    });

    await batch.commit();
    console.log("Friend request sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

const cancelFriendRequest = async (currentUserId, receiverId) => {
  try {
    const currentUserRef = doc(db, "users", currentUserId);
    const receiverRef = doc(db, "users", receiverId);
    const batch = writeBatch(db);

    batch.update(currentUserRef, {
      [`friendRequestsSent.${receiverId}`]: deleteField(),
    });

    batch.update(receiverRef, {
      [`friendRequestsReceived.${currentUserId}`]: deleteField(),
    });

    await batch.commit();
    console.log("Friend request cancelled successfully");
    return true;
  } catch (error) {
    console.error("Error cancelling friend request:", error);
    throw error;
  }
};

const acceptFriendRequest = async (currentUserId, requesterId) => {
  try {
    const currentUserRef = doc(db, "users", currentUserId);
    const requesterRef = doc(db, "users", requesterId);
    const batch = writeBatch(db);

    batch.update(currentUserRef, {
      [`friends.${requesterId}`]: true,
      [`friendRequestsReceived.${requesterId}`]: deleteField(),
    });

    batch.update(requesterRef, {
      [`friends.${currentUserId}`]: true,
      [`friendRequestsSent.${currentUserId}`]: deleteField(),
    });

    await batch.commit();
    console.log("Friend request accepted successfully.");
    return true;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

const rejectFriendRequest = async (currentUserId, requesterId) => {
  try {
    const currentUserRef = doc(db, "users", currentUserId);
    const requesterRef = doc(db, "users", requesterId);
    const batch = writeBatch(db);

    batch.update(currentUserRef, {
      [`friendRequestsReceived.${requesterId}`]: deleteField(),
    });

    batch.update(requesterRef, {
      [`friendRequestsSent.${currentUserId}`]: deleteField(),
    });

    await batch.commit();
    console.log("Friend request rejected successfully.");
    return true;
  } catch (error) {
    console.error("Error rejecting friend request:", error);
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
  updateUserData: updateUserData,
  sendFriendRequest: sendFriendRequest,
  cancelFriendRequest: cancelFriendRequest,
  acceptFriendRequest: acceptFriendRequest,
  rejectFriendRequest: rejectFriendRequest,
};
