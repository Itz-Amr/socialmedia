import styles from "./index.module.css";
import user from "../../../../assets/user.jpg";
import { CiEdit, CiLocationOn } from "react-icons/ci";
import { SlCamera } from "react-icons/sl";

export default function AddPost() {
  return (
    <div className="" id={styles.container}>
      <div
        className="col-12 d-flex align-items-center justify-content-center gap-2"
        id={styles.publish}
      >
        <CiEdit className={styles.icon} />
        <h6>Publish</h6>
      </div>

      <div id={styles.textArea}>
        <img src={user} alt="" />
        <textarea placeholder="Write Somthing About You" />
      </div>

      <div className="col-12 d-flex gap-3 align-items-center justify-content-center">
        <label
          className="d-flex align-items-center justify-content-center gap-2"
          id={styles.btn}
          htmlFor="media-upload"
          style={{ cursor: "pointer" }}
        >
          <SlCamera />
          Post Media
          <input type="file" id="media-upload" accept="image/*,video/*" />
        </label>

        <button
          className="d-flex align-items-center justify-content-center gap-2"
          id={styles.btn}
        >
          <CiLocationOn />
          Post Location
        </button>
      </div>
    </div>
  );
}
