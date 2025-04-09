import styles from "./index.module.css";
import user from "../../../../assets/user.jpg";
import FriendsList from "../../../../Components/Friends list";

export default function Messages() {
  return (
    <div className="p-3 d-flex flex-column" id={styles.parnet}>
      <header>
        <img src={user} alt="" />
        <h5>Ali Ahmed</h5>
      </header>
      <div className={styles.chatContainer}>
        <FriendsList />
      </div>
    </div>
  );
}
