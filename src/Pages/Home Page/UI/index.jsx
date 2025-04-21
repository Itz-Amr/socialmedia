import AddPost from "../Components/Add Post";
import Posts from "../Components/Posts";
import Temperature from "../Components/Temperature";
import styles from "./index.module.css";

export default function Home() {
  return (
    <main className="p-3 d-flex flex-row gap-3 overflow-auto">
      <div className={styles.sidebar}>
        <Temperature />
      </div>

      <div className="d-flex flex-column gap-3 flex-grow-1">
        <AddPost />
        <Posts />
      </div>
    </main>
  );
}
