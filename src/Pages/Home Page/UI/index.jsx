import AddPost from "../Components/Add Post";
import Friends from "../Components/Friends";
import Posts from "../Components/Posts";
import Temperature from "../Components/Temperature";
import styles from "./index.module.css";

export default function Home() {
  return (
    <main className={` d-flex flex-row gap-3 ${styles.mainContainer}`}>
      <div className={styles.sidebar}>
        <Temperature />
      </div>

      <div className={`d-flex flex-column gap-3 ${styles.contentArea}`}>
        <AddPost />
        <Posts />
      </div>
    </main>
  );
}
