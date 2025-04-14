import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import defaultCover from "../../../../assets/no-img-avalabie.jpeg";
import { curretUserId } from "../../../../Store";
import { usersRepo } from "../../../../Data/Repos/users_repo";
import LoadingModal from "../../../../Components/Loading Modal";

export default function UserImageCover() {
  const fileInputRef = useRef(null);
  const [coverImage, setCoverImage] = useState(defaultCover);
  const [userData, setUserData] = useState();

  const handleCoverClick = () => {
    fileInputRef.current.click();
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  useEffect(() => {
    usersRepo.getUserData(curretUserId).then((res) => {
      setUserData(res);
    });
  }, []);

  if (!userData) {
    return <LoadingModal />;
  }
  return (
    <div
      className="col-12 d-flex flex-column p-3 overflow-auto"
      id={styles.body}
    >
      <div className={styles.profileCover}>
        <div
          className={styles.coverImage}
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <button className={styles.editCover} onClick={handleCoverClick}>
            📷 Edit cover image
          </button>
          <input
            type="file"
            accept="image/"
            ref={fileInputRef}
            onChange={handleCoverChange}
            className="d-none"
          />
        </div>

        <div className={styles.profileDetails}>
          <div className="z-1 d-flex flex-column align-items-center gap-2">
            <img src={userData.imgUrl} className={styles.profilePic} />
            <h5 className="m-0 fw-bold">{userData.name}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
