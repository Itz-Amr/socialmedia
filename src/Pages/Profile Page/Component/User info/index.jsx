import { useState, useEffect, useCallback } from "react";
import { IoEarth, IoHeart, IoLocation, IoSchool } from "react-icons/io5";
import styles from "./index.module.css";
import LoadingModal from "../../../../Components/Loading Modal";
import { useEditUserInfoModal } from "../../../../Store"; // Import useAuthStore
import { usersRepo } from "../../../../Data/Apis/show_users";
import EditUserInfoModal from "../../../../Components/EditUserInfoModal";
import { useAuthStore } from "../../../../Store/authStore";

export default function UserInfo({ profileUserId }) {
  const { isOpen, openModal, closeModal, updatedUserInfo } =
    useEditUserInfoModal();
  const [userData, setUserData] = useState({
    studiedAt: "",
    marriedTo: "",
    from: "",
    livesIn: "",
  });
  const { currentUser } = useAuthStore(); // Get the current user
  const currentLoggedInUserId = currentUser?.uid; // Safely access the uid

  const fetchUserData = useCallback((userId) => {
    let isMounted = true;
    usersRepo
      .getUserData(userId)
      .then((res) => {
        if (isMounted && res) {
          setUserData(res);
        }
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        if (isMounted) {
          setUserData({
            studiedAt: "",
            marriedTo: "",
            from: "",
            livesIn: "",
          });
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetchUserData(profileUserId);
  }, [profileUserId, fetchUserData]);

  useEffect(() => {
    if (updatedUserInfo) {
      setUserData(updatedUserInfo); // تحديث البيانات عند الحفظ
    }
  }, [updatedUserInfo]);

  const handleEdit = () => {
    openModal(userData); // فتح المودال مع البيانات الحالية
  };

  const handleSaveSuccess = useCallback(() => {
    fetchUserData(profileUserId); // تحديث البيانات من الفايربيز بعد الحفظ
  }, [profileUserId, fetchUserData]);

  if (!userData && !isOpen) {
    return <LoadingModal />;
  }

  return (
    <div className="d-flex flex-column col-md-12 gap-3" id={styles.body}>
      <div
        className="p-3 bg-white d-flex align-items-center justify-content-between"
        id={styles.info}
      >
        <h6 className="m-0 fw-bold">Basic info</h6>
        {profileUserId === currentLoggedInUserId && ( // Use currentUser.uid for comparison
          <button className={styles.editBtn} onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>

      <div className="d-flex flex-column bg-white rounded">
        {userData?.studiedAt && (
          <div
            className="p-3 d-flex align-items-center justify-content-between"
            id={styles.infoContainer}
          >
            <div>
              <span className="fw-bold">Studied at</span>
              <p className="fw-bold m-0">{userData.studiedAt}</p>
            </div>
            <IoSchool className={styles.icon} />
          </div>
        )}
        {userData?.marriedTo && (
          <div
            className="p-3 d-flex align-items-center justify-content-between"
            id={styles.infoContainer}
          >
            <div>
              <span className="fw-bold">Married to</span>
              <p className="fw-bold m-0">{userData.marriedTo}</p>
            </div>
            <IoHeart className={styles.icon} />
          </div>
        )}
        {userData?.from && (
          <div
            className="p-3 d-flex align-items-center justify-content-between"
            id={styles.infoContainer}
          >
            <div>
              <span className="fw-bold">From</span>
              <p className="fw-bold m-0">{userData.from}</p>
            </div>
            <IoEarth className={styles.icon} />
          </div>
        )}
        {userData?.livesIn && (
          <div
            className="p-3 d-flex align-items-center justify-content-between"
            id={styles.infoContainer}
          >
            <div>
              <span className="fw-bold">Lives in</span>
              <p className="fw-bold m-0">{userData.livesIn}</p>
            </div>
            <IoLocation className={styles.icon} />
          </div>
        )}
      </div>
      {isOpen && (
        <EditUserInfoModal
          initialInfo={userData}
          onClose={closeModal}
          profileUserId={profileUserId}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
