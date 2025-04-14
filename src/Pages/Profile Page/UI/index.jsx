import UserImageCover from "../Component/User image cover";
import UserInfo from "../Component/User info";
import UserPosts from "../Component/User Posts";
import styles from "./index.module.css";
export default function Profile() {
  return (
    <div className="col-12 py-3 px-5 overflow-auto" id={styles.body}>
      <UserImageCover />
      <div className="p-3 d-flex gap-3 justify-content-between">
        <div className={styles.sidebar}>
          <UserInfo />
        </div>

        <div className="d-flex flex-column gap-3 flex-grow-1">
          <UserPosts />
          <UserPosts />
          <UserPosts />
          <UserPosts />
        </div>
      </div>
    </div>
  );
}
