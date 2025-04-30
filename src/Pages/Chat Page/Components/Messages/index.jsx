import styles from "./index.module.css";
import noImg from "../../../../assets/no-img-avalabie.jpeg";
import FriendsList from "../../../../Components/Friends list";
import { Link } from "react-router-dom";
import { usersRepo } from "../../../../Data/Repos/users_repo";
import { useEffect, useState } from "react";
import LoadingModal from "../../../../Components/Loading Modal";
import { IoMdClose } from "react-icons/io";
import { useAuthStore } from "../../../../Store/authStore";

export default function Messages() {
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuthStore(); // Get the current user
  const userId = currentUser?.uid; // Safely access the uid

  useEffect(() => {
    if (userId) {
      usersRepo.getUserData(userId).then((res) => {
        setUserData(res);
      });
    }
  }, [userId]); // Fetch user data when userId changes

  return userData ? (
    <div className="p-3 d-flex flex-column" id={styles.parnet}>
      <header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img src={userData.imgUrl || noImg} alt="" />
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
