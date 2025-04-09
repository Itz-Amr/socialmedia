import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { FaRegUserCircle } from "react-icons/fa";

export default function Dropdown() {
  const navigate = useNavigate();
  const handleLogOut = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="btn-group dropup" id={styles.dropDown}>
        <FaRegUserCircle
          id={styles.icon}
          data-bs-toggle="dropdown"
          aria-expanded="false"
        />

        <ul className="dropdown-menu">
          <li>
            <button className="dropdown-item">Profile</button>
          </li>

          <li>
            <button className="dropdown-item">Settings</button>
          </li>

          <li>
            <button onClick={handleLogOut} className="dropdown-item">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
