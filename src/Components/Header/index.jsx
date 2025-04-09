import {
  LiaBellSolid,
  LiaHomeSolid,
  LiaUserFriendsSolid,
} from "react-icons/lia";
import styles from "./index.module.css";
import { FiMessageSquare } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo/logo-V.png";
import person from "../../assets/user.jpg";

export default function Header() {
  return (
    <header className="p-3 d-flex align-items-center justify-content-between">
      <div className="d-flex gap-3 align-items-center">
        <img src={logo} alt="" />

        <Link to={"/"} className="position-relative">
          <span className={styles.counter}>0</span>
          <LiaHomeSolid className={styles.homeIcon} />
        </Link>

        <Link className="position-relative">
          <span className={styles.counter}>0</span>
          <LiaUserFriendsSolid className={styles.friendsIcon} />
        </Link>

        <Link to={"/chat"} className="position-relative">
          <span className={styles.counter}>0</span>
          <FiMessageSquare className={styles.msgIcon} />
        </Link>

        <Link className="position-relative">
          <span className={styles.counter}>0</span>
          <LiaBellSolid className={styles.notiIcon} />
        </Link>
        {/* <LiaHeart className={styles.icon} /> */}
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
        <img src={person} alt="" />
      </div>
    </header>
  );
}
