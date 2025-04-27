import styles from "./index.module.css";
import user from "../../../../assets/user.jpg";

export default function Friends() {
  return (
    <div className="p-3 shadow d-flex flex-column gap-3" id={styles.body}>
      <h5 className="m-0 fw-bold">Friends</h5>

      <div
        className="overflow-auto d-flex flex-column gap-3"
        id={styles.container}
      >
        <div
          className="d-flex align-items-center p-3 gap-2"
          id={styles.friendsList}
        >
          <img src={user} alt="" />
          <h6 className="m-0">Ahmed ali</h6>
        </div>
      </div>
    </div>
  );
}
