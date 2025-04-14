import styles from "./index.module.css";
import noImg from "../../../../assets/no-img-avalabie.jpeg";
import FriendsList from "../../../../Components/Friends list";
import { Link } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { usersRepo } from "../../../../Data/Repos/users_repo";
import { useEffect, useState } from "react";
import { curretUserId } from "../../../../Store";
import LoadingModal from "../../../../Components/Loading Modal";

export default function Messages() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    usersRepo.getUserData(curretUserId).then((res) => {
      setUserData(res);
    });
  }, []);

  return userData ? (
    <div className="p-3 d-flex flex-column" id={styles.parnet}>
      <header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img src={userData.imgUrl || noImg} alt="" />
          <h5>{userData.name || "No available name "}</h5>
        </div>
        <Link to={"/"}>
          <RiCloseLine className={styles.exitIcon} />
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
