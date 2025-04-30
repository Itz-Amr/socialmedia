import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import defaultCover from "../../../../assets/no-img-avalabie.jpeg";
import { usersRepo } from "../../../../Data/Repos/users_repo";
import LoadingModal from "../../../../Components/Loading Modal";
import { useAuthStore } from "../../../../Store/authStore";
import { FaUserCircle } from "react-icons/fa";

export default function UserImageCover({ profileUserId }) {
  const fileInputRef = useRef(null);
  const [coverImage, setCoverImage] = useState(defaultCover);
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuthStore();
  const currentLoggedInUserId = currentUser?.uid;

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
          {profileUserId === currentLoggedInUserId && (
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
            {userData?.imgUrl ? (
              <img
                src={userData.imgUrl}
                alt={userData?.name || "User Profile"}
                className={styles.profilePic}
              />
            ) : (
              <img
                src={defaultCover}
                alt="Default Avatar"
                className={styles.profilePic}
              />
            )}

            <h5 className="m-0 fw-bold">{userData?.name || "Unknown User"}</h5>
          </div>

          {/* <div className="">
            <button>Add Friend</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
