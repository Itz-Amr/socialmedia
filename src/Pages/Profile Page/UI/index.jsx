import styles from "./index.module.css";
import { useParams } from "react-router-dom";
import UserImageCover from "../Component/User image cover";
import UserInfo from "../Component/User info";
import UserPosts from "../Component/User Posts";
import { useAuthStore } from "../../../Store/authStore";

export default function Profile() {
  const { userId: otherUserId } = useParams();
  const { currentUser } = useAuthStore(); // Get current authenticated user
  const currentLoggedInUserId = currentUser.uid;
  const profileUserId = otherUserId || currentLoggedInUserId;

  return (
    <div className="col-12 py-3 px-5 overflow-auto" id={styles.body}>
      <UserImageCover profileUserId={profileUserId} />
      <div
        className="p-3 d-flex flex-lg-row flex-md-row flex-sm-column gap-3 justify-content-between"
        id={styles.container}
      >
        <div className={styles.sidebar}>
          <UserInfo profileUserId={profileUserId} />
        </div>

        <div className="d-flex flex-column gap-3 flex-grow-1">
          <UserPosts profileUserId={profileUserId} />
        </div>
      </div>
    </div>
  );
}
