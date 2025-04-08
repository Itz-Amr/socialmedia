import styles from "./index.module.css";
import user from "../../../../assets/user.jpg";

export default function FriendsChat() {
  return (
    <div
      className="d-flex align-items-center justify-content-start flex-row gap-3"
      id={styles.parent}
    >
      <img src={user} alt="" />
      <h6>Ali ahmed</h6>
    </div>
  );
}
