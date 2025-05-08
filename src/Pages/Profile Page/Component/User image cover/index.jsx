import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import defaultCover from "../../../../assets/no-img-avalabie.jpeg";
import LoadingModal from "../../../../Components/Loading Modal";
import { useAuthStore } from "../../../../Store/authStore";
import { IoPersonAdd } from "react-icons/io5";
import { BsFillPersonXFill, BsFillPersonCheckFill } from "react-icons/bs";
import { usersRepo } from "../../../../Data/Apis/show_users";

export default function UserImageCover({ profileUserId }) {
  const fileInputRef = useRef(null);
  const [coverImage, setCoverImage] = useState(defaultCover);
  const [userData, setUserData] = useState(null);
  const [friendStatus, setFriendStatus] = useState("loading"); // 'loading', 'add', 'pending', 'friends', 'received'
  const [isLoading, setIsLoading] = useState(true);
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
      // In a real app, you would upload this file to Firebase Storage
      // and update the user document with the new cover image URL
    }
  };

  const handleAddFriendClick = async () => {
    if (!currentLoggedInUserId || !profileUserId) return;

    try {
      if (friendStatus === "add") {
        await usersRepo.sendFriendRequest(currentLoggedInUserId, profileUserId);
        setFriendStatus("pending");
      } else if (friendStatus === "pending") {
        await usersRepo.cancelFriendRequest(
          currentLoggedInUserId,
          profileUserId
        );
        setFriendStatus("add");
      } else if (friendStatus === "received") {
        await usersRepo.acceptFriendRequest(
          currentLoggedInUserId,
          profileUserId
        );
        setFriendStatus("friends");
      }
    } catch (error) {
      console.error("Error handling friend action:", error);
    }
  };

  const handleRejectRequest = async () => {
    if (!currentLoggedInUserId || !profileUserId) return;

    try {
      if (friendStatus === "received") {
        await usersRepo.rejectFriendRequest(
          currentLoggedInUserId,
          profileUserId
        );
        setFriendStatus("add");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchUserDataAndFriendStatus = async () => {
      if (!currentLoggedInUserId || !profileUserId) {
        setIsLoading(false);
        return;
      }

      try {
        // Get profile user data
        const profileUserData = await usersRepo.getUserData(profileUserId);

        if (!isMounted) return;

        if (profileUserData) {
          setUserData(profileUserData);

          // If viewing own profile, no friend status needed
          if (profileUserId === currentLoggedInUserId) {
            setFriendStatus(null);
            setIsLoading(false);
            return;
          }

          // Get current user's data to check friendship status
          const currentUserData = await usersRepo.getUserData(
            currentLoggedInUserId
          );

          if (!isMounted) return;

          // Check if they are already friends
          if (
            currentUserData?.friends &&
            currentUserData.friends[profileUserId]
          ) {
            setFriendStatus("friends");
          }
          // Check if current user sent a request to profile user
          else if (
            currentUserData?.friendRequestsSent &&
            currentUserData.friendRequestsSent[profileUserId]
          ) {
            setFriendStatus("pending");
          }
          // Check if profile user sent a request to current user
          else if (
            currentUserData?.friendRequestsReceived &&
            currentUserData.friendRequestsReceived[profileUserId]
          ) {
            setFriendStatus("received");
          }
          // No relationship yet
          else {
            setFriendStatus("add");
          }
        } else {
          setUserData(null);
          setFriendStatus("add");
        }
      } catch (error) {
        console.error("Error fetching user data or friend status:", error);
        setFriendStatus("add");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserDataAndFriendStatus();

    return () => {
      isMounted = false;
    };
  }, [profileUserId, currentLoggedInUserId]);

  if (isLoading) {
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
          style={{
            backgroundImage: `url(${userData?.coverImageUrl || coverImage})`,
          }}
        >
          {profileUserId === currentLoggedInUserId && (
            <button className={styles.editCover} onClick={handleCoverClick}>
              📷 Edit cover image
            </button>
          )}
          <input
            type="file"
            accept="image/*"
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
          <div className="col-12 position-relative d-flex align-items-center justify-content-start">
            {profileUserId !== currentLoggedInUserId && friendStatus && (
              <>
                <button
                  className={styles.btnAdd}
                  onClick={handleAddFriendClick}
                >
                  {friendStatus === "add" && (
                    <>
                      <IoPersonAdd /> Add Friend
                    </>
                  )}
                  {friendStatus === "pending" && (
                    <>
                      <BsFillPersonXFill /> Cancel Request
                    </>
                  )}
                  {friendStatus === "friends" && (
                    <>
                      <BsFillPersonCheckFill /> Friends
                    </>
                  )}
                  {friendStatus === "received" && (
                    <>
                      <BsFillPersonCheckFill /> Accept Request
                    </>
                  )}
                </button>

                {friendStatus === "received" && (
                  <button
                    className={`${styles.btnAdd} ${styles.btnReject}`}
                    onClick={handleRejectRequest}
                  >
                    <BsFillPersonXFill /> Reject
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
