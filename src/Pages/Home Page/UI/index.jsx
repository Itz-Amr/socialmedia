import AddPost from "../Components/Add Post";
import Friends from "../Components/Friends";
import Posts from "../Components/Posts";
import Temperature from "../Components/Temperature";
import styles from "./index.module.css";

export default function Home() {
  return (
    <main className={` d-flex flex-column gap-3 ${styles.mainContainer}`}>
      <AddPost />
      <div className="d-flex gap-3">
        <div className={styles.sidebar}>
          <Temperature />
        </div>
        <Posts />
      </div>
      {/* <div className={`d-flex column gap-3 ${styles.contentArea}`}></div> */}
    </main>
  );
}
