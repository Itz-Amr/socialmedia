import { useEffect } from "react";
import styles from "./index.module.css";
import { usersRepo } from "../../../../Data/Repos/users_repo";
import { useState } from "react";
import { curretUserId } from "../../../../Store";
import LoadingModal from "../../../../Components/Loading Modal";
import { IoMdClose } from "react-icons/io";
import { LiaCommentAlt, LiaHeart } from "react-icons/lia";
import { CiShare2 } from "react-icons/ci";

export default function UserPosts() {
  const [userData, setUserData] = useState();
  useEffect(() => {
    usersRepo.getUserData(curretUserId).then((res) => {
      setUserData(res);
    });
  }, []);

  if (!userData) {
    return <LoadingModal />;
  }
  return (
    <div className="p-3 bg-white d-flex flex-column gap-3" id={styles.body}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img src={userData.imgUrl} alt="" />
          <h5 className="m-0 fw-bold">{userData.name}</h5>
        </div>
        <IoMdClose className={styles.exitIcon} />
      </div>

      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam
        porro sed consequuntur illum provident, architecto, totam eum nisi
        delectus doloremque facere in voluptatum, officiis aspernatur a aperiam
        tempora. Ducimus, enim!
      </p>

      <div className="d-flex justify-content-between">
        <button>
          <LiaHeart className={styles.icon} />
          Like
        </button>

        <button>
          <LiaCommentAlt className={styles.icon} />
          Comment
        </button>

        <button>
          <CiShare2 className={styles.icon} />
          Send
        </button>
      </div>
    </div>
  );
}
