import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import defaultCover from "../../../../assets/no-img-avalabie.jpeg";
import { usersRepo } from "../../../../Data/Repos/users_repo";
import LoadingModal from "../../../../Components/Loading Modal";
import { curretUserId } from "../../../../Store"; // Import for comparison

export default function UserImageCover({ profileUserId }) {
  const fileInputRef = useRef(null);
  const [coverImage, setCoverImage] = useState(defaultCover);
  const [userData, setUserData] = useState(null);

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
    let isMounted = true;
    setUserData(null);
    console.log("UserImageCover useEffect started for:", profileUserId);
    usersRepo
      .getUserData(profileUserId)
      .then((res) => {
        console.log("UserImageCover data fetched:", res);
        if (isMounted && res) {
          setUserData(res);
          setCoverImage(res?.coverUrl || defaultCover);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data in UserImageCover:", error);
        if (isMounted) {
          setUserData({});
        }
      })
      .finally(() => {
        console.log("UserImageCover useEffect finished for:", profileUserId);
      });

    return () => {
      isMounted = false;
    };
  }, [profileUserId]);

  if (userData === null) {
    console.log("UserImageCover: userData is null, showing LoadingModal");
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
          {profileUserId === curretUserId && (
            <button className={styles.editCover} onClick={handleCoverClick}>
              📷 Edit cover image
            </button>
          )}
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
            <img
              src={userData?.imgUrl || "/default-avatar.jpg"}
              className={styles.profilePic}
              alt={userData?.name || "User Profile"}
            />
            <h5 className="m-0 fw-bold">{userData?.name || "Unknown User"}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
