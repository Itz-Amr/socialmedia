import FriendsList from "../../../Components/Friends list";
import AddPost from "../Components/Add Post";
import Posts from "../Components/Posts";
import Temperature from "../Components/Temperature";
import styles from "./index.module.css";

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
    </main>
  );
}
