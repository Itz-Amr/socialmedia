import styles from "./index.module.css";
import { CiEdit, CiLocationOn } from "react-icons/ci";
import { SlCamera } from "react-icons/sl";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import db from "../../../../FireBase";
import { usersRepo } from "../../../../Data/Repos/users_repo";
import { useAuthStore } from "../../../../Store/authStore";
import { FaUserCircle } from "react-icons/fa";

export default function AddPost() {
  const [userData, setUserData] = useState(null);
  const textRef = useRef();
  const { currentUser } = useAuthStore();
  const userId = currentUser?.uid;

  const handleAddPost = async () => {
    const content = textRef.current?.value.trim();
    if (!content || !userId) return;

    await addDoc(collection(db, "posts"), {
      content,
      userId: userId,
      dateAndTime: Timestamp.now(),
    });
    textRef.current.value = "";
  };

  useEffect(() => {
    if (userId) {
      usersRepo.getUserData(userId).then((res) => {
        setUserData(res);
      });
    }
  }, [userId]);

  if (!userData) {
    return null;
  }

  return (
    <div className="" id={styles.container}>
      <div
        className="col-12 d-flex align-items-center justify-content-center gap-2"
        id={styles.publish}
      >
        <CiEdit className={styles.icon} />
        <h6>Publish</h6>
      </div>

      <div id={styles.textArea}>
        <div className={styles.userAvatar}>
          {userData.imgUrl ? (
            <img src={userData.imgUrl} alt="" />
          ) : (
            <FaUserCircle className="fs-2" />
          )}
        </div>
        <textarea ref={textRef} placeholder="Write Something About You" />
      </div>

      <div className="col-12 d-flex gap-3 align-items-center justify-content-around">
        <button
          onClick={handleAddPost}
          className="d-flex align-items-center justify-content-center gap-2"
          id={styles.btn}
          disabled={!userId}
        >
          <IoMdAdd className={styles.icon} />
          Add Post
        </button>
        <label
          className="d-flex align-items-center justify-content-center gap-2"
          id={styles.btn}
          htmlFor="media-upload"
          style={{ cursor: "pointer" }}
        >
          <SlCamera className={styles.icon} />
          Post Media
          <input type="file" id="media-upload" accept="image/*,video/*" />
        </label>

        <button
          className="d-flex align-items-center justify-content-center gap-2"
          id={styles.btn}
        >
          <CiLocationOn className={styles.icon} />
          Post Location
        </button>
      </div>
    </div>
  );
}
