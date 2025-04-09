import styles from "./index.module.css";
import user from "../../../../assets/user.jpg";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { VscSend } from "react-icons/vsc";

export default function MessagesContent() {
  return (
    <div className="flex-grow-1 d-flex flex-column" id={styles.parnet}>
      <header className="d-flex align-items-center p-3 gap-2">
        <img src={user} alt="" />
        <h5>Ali Ahmed</h5>
      </header>

      <div className="p-3 d-flex flex-column gap-3" id={styles.chat}>
        <div id={styles.msgs}>
          <p className={styles.notMyMsg}>Hi im find what about you</p>

          <p className={styles.myMsg}>Hello how are you</p>
          <p className={styles.myMsg}>Hello how are you</p>
          <p className={styles.myMsg}>Hello how are you</p>
          <p className={styles.myMsg}>Hello how are you</p>
          <p className={styles.myMsg}>Hello how are you</p>
        </div>
      </div>

      <div
        className="p-3 d-flex align-items-center justify-content-center"
        id={styles.footer}
      >
        <div className="col-12 position-relative">
          <div
            className="position-absolute d-flex align-items-center justify-content-between gap-3"
            id={styles.icons}
          >
            <MdOutlineAddPhotoAlternate className={styles.icon} />
            <VscSend className={styles.sendIcon} />
          </div>

          <input type="text" />
        </div>
      </div>
    </div>
  );
}
