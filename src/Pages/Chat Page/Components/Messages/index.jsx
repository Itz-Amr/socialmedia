import React, { useEffect, useState, useCallback } from "react";
import styles from "./index.module.css";
import FriendsList from "../../../../Components/Friends list";
import { Link } from "react-router-dom";
import LoadingModal from "../../../../Components/Loading Modal";
import { IoMdClose } from "react-icons/io";
import { useAuthStore } from "../../../../Store/authStore";
import { usersRepo } from "../../../../Data/Apis/show_users";
import { FaUserCircle } from "react-icons/fa";

export default function Messages() {
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuthStore();
  const userId = currentUser?.uid;
  const [refreshFriends, setRefreshFriends] = useState(false);

  useEffect(() => {
    if (userId) {
      usersRepo.getUserData(userId).then((res) => {
        setUserData(res);
      });
    }
  }, [userId]);

  const handleFriendAccepted = useCallback(() => {
    setRefreshFriends((prev) => !prev);
  }, []);

  return userData ? (
    <div className="p-3 d-flex flex-column" id={styles.parnet}>
      <header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          {userData.imgUrl ? (
            <img src={userData.imgUrl} alt="" />
          ) : (
            <FaUserCircle className="fs-2" />
          )}
          <h5>{userData.name || "No available name "}</h5>
        </div>
        <Link to={"/"}>
          <IoMdClose className={styles.exitIcon} />
        </Link>
      </header>
      <div className={styles.chatContainer}>
        <FriendsList />
      </div>
    </div>
  ) : (
    <LoadingModal />
  );
}
