import AddPost from "./Add Post";
import FriendsList from "./Friends list";
import styles from "./index.module.css";
import Posts from "./Posts";
import Temperature from "./Temperature";

export default function Home() {
  return (
    <main className="p-3 d-flex flex-row overflow-auto">
      <div className="p-3" id={styles.temp}>
        <Temperature />
      </div>

      <div className="p-3 d-flex flex-column gap-3" id={styles.content}>
        <AddPost />
        <Posts />
      </div>

      <div className="p-3" id={styles.friends}>
        <FriendsList />
      </div>
    </main>
  );
}
