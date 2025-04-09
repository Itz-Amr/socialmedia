import { useEffect, useState } from "react";
import FriendsChat from "../Friends Chat";
import styles from "./index.module.css";
import db from "../../FireBase";
import { collection, onSnapshot } from "firebase/firestore";

export default function FriendsList() {
  const [users, setUsers] = useState([]);

  const getUsersLive = () => {
    onSnapshot(collection(db, "users"), (users) => {
      let final = [];
      users.forEach((el) => {
        let userObj = { ...el.data(), documentId: el.id };
        final.push(userObj);
      });
      setUsers(final);
    });
  };

  useEffect(() => {
    getUsersLive();
  }, []);

  return (
    <div className="col-12 h-100 d-flex flex-column p-3" id={styles.parent}>
      <div
        className="d-flex align-items-start justify-content-start"
        id={styles.header}
      >
        <h6>Friends</h6>
      </div>
      <div className="d-flex flex-column gap-3 overflow-auto">
        {users.map((el) => (
          <FriendsChat key={el.documentId} name={el.name} imgUrl={el.imgUrl} />
        ))}
      </div>
    </div>
  );
}
