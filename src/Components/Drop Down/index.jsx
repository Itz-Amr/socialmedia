import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import styles from "./index.module.css";

export default function Dropdown({ userData, onLogoutClick }) {
  return (
    <div>
      <div className="btn-group dropup" id={styles.dropDown}>
        {userData?.imgUrl ? (
          <img
            src={userData.imgUrl}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          />
        ) : (
          <FaUserCircle
            className="fs-2 text-dark"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          />
        )}

        <ul className="dropdown-menu">
          <li>
            <Link to="/profile" className="dropdown-item fw-bold text-center">
              Profile
            </Link>
          </li>
          <li>
            <button
              className="dropdown-item fs-6 fw-bold text-center"
              onClick={onLogoutClick}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
