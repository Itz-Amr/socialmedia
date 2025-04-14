import { IoEarth, IoHeart, IoLocation, IoSchool } from "react-icons/io5";
import styles from "./index.module.css";
import { FaUserFriends } from "react-icons/fa";

export default function UserInfo() {
  return (
    <div className="d-flex flex-column gap-3" id={styles.body}>
      <div className="p-3 bg-white" id={styles.info}>
        <h5 className="m-0 fw-bold">Basic info</h5>
      </div>

      <div className="d-flex flex-column  bg-white rounded">
        <div
          className="p-3 d-flex align-items-center justify-content-between"
          id={styles.infoContainer}
        >
          <div>
            <span className="fw-bold">Studied at</span>
            <p className="fw-bold m-0">ErraSoft</p>
          </div>
          <IoSchool className={styles.icon} />
        </div>

        <div
          className="p-3 d-flex align-items-center justify-content-between"
          id={styles.infoContainer}
        >
          <div>
            <span className="fw-bold">Married to</span>
            <p className="fw-bold m-0">7mada</p>
          </div>
          <IoHeart className={styles.icon} />
        </div>

        <div
          className="p-3 d-flex align-items-center justify-content-between"
          id={styles.infoContainer}
        >
          <div>
            <span className="fw-bold">From</span>
            <p className="fw-bold m-0">Egypt</p>
          </div>
          <IoEarth className={styles.icon} />
        </div>

        <div
          className="p-3 d-flex align-items-center justify-content-between"
          id={styles.infoContainer}
        >
          <div>
            <span className="fw-bold">Lives in</span>
            <p className="fw-bold m-0">Cairo</p>
          </div>
          <IoLocation className={styles.icon} />
        </div>

        <div className="p-3 d-flex align-items-center justify-content-between">
          <div>
            <span className="fw-bold">Friends</span>
            <p className="fw-bold m-0">0</p>
          </div>
          <FaUserFriends className={styles.icon} />
        </div>
      </div>
    </div>
  );
}
