import { LiaBellSolid, LiaHomeSolid } from "react-icons/lia";
import styles from "./index.module.css";
import { FiMessageSquare } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo/logo-V.png";
import { useEffect, useState } from "react";
import { usersRepo } from "../../Data/Repos/users_repo";
import { useAuthStore } from "../../Store/authStore";
import noImg from "../../assets/no-img-avalabie.jpeg";

export default function Header() {
  const [userData, setUserData] = useState();
  const { currentUser } = useAuthStore(); // Get the current user
  const userId = currentUser?.uid; // Safely access the uid

  useEffect(() => {
    if (userId) {
      usersRepo.getUserData(userId).then((res) => {
        console.log(res);

        setUserData(res);
      });
    }
  }, [userId]); // Fetch user data when userId changes

  if (!userData) {
    return null;
  }

  return (
    <header className="p-3 d-flex align-items-center justify-content-between">
      <div className="d-flex gap-3 align-items-center">
        <img src={logo} alt="" />

        <Link title="Home" to={"/"} className="position-relative">
          <span className={styles.counter}>0</span>
          <LiaHomeSolid className={styles.homeIcon} />
        </Link>

        <Link title="Chat" to={"/chat"} className="position-relative">
          <span className={styles.counter}>0</span>
          <FiMessageSquare className={styles.msgIcon} />
        </Link>

        <Link title="Notifications" className="position-relative">
          <span className={styles.counter}>0</span>
          <LiaBellSolid className={styles.notiIcon} />
        </Link>
      </div>

      <div className="d-flex gap-3 align-items-center">
        <div className="position-relative">
          <CiSearch className={styles.searchIcon} />
          <input type="search" placeholder="Search" />
        </div>
        <Link className="position-relative">
          <span className={styles.counter}>0</span>
          <IoCartOutline className={styles.cartIcon} />
        </Link>

        <Link to={"/profile"}>
          <img src={userData.imgUrl || noImg} alt="Profile" />
        </Link>
      </div>
    </header>
  );
}
