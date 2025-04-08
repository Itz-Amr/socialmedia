import FriendsChat from "./Friends Chat";
import styles from "./index.module.css";

export default function FriendsList() {
  return (
    <div className="col-12 h-100 d-flex flex-column p-3" id={styles.parent}>
      <div className="d-flex align-items-start justify-content-start">
        <h6>Friends</h6>
      </div>
      <div className="d-flex flex-column gap-3 overflow-auto">
        <FriendsChat />
        <FriendsChat />
        <FriendsChat />
        <FriendsChat />
        <FriendsChat />
        <FriendsChat />
        <FriendsChat />
      </div>
    </div>
  );
}
