import { LiaBellSolid, LiaHomeSolid } from "react-icons/lia";
import styles from "./index.module.css";
import { FiMessageSquare } from "react-icons/fi";
import { IoCartOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo/logo-V.png";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../Store/authStore";
import noImg from "../../assets/no-img-avalabie.jpeg";
import { BsFillPersonCheckFill, BsFillPersonXFill } from "react-icons/bs";
import LoadingModal from "../Loading Modal";
import { usersRepo } from "../../Data/Apis/show_users";
import Dropdown from "../Drop Down";

export default function Header() {
  const [userData, setUserData] = useState(null);
  const [friendRequestsData, setFriendRequestsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, logout } = useAuthStore();
  const userId = currentUser?.uid;

  const [searchInput, setSearchInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  const fetchFriendRequests = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const userDoc = await usersRepo.getUserData(userId);
      setUserData(userDoc);

      const receivedRequests = userDoc?.friendRequestsReceived || {};
      const requesterIds = Object.keys(receivedRequests);

      if (requesterIds.length === 0) {
        setFriendRequestsData([]);
        setIsLoading(false);
        return;
      }

      const requestsData = await Promise.all(
        requesterIds.map(async (requesterId) => {
          try {
            const requesterInfo = await usersRepo.getUserData(requesterId);
            return requesterInfo ? { ...requesterInfo, requesterId } : null;
          } catch (error) {
            console.error(
              `Error fetching data for requester ${requesterId}:`,
              error
            );
            return null;
          }
        })
      );

      setFriendRequestsData(requestsData.filter(Boolean));
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      setFriendRequestsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
    } else {
      setUserData(null);
      setFriendRequestsData([]);
      setIsLoading(false);
    }
  }, [userId]);

  const handleAcceptRequest = async (requesterId) => {
    if (!userId || !requesterId) return;

    try {
      await usersRepo.acceptFriendRequest(userId, requesterId);
      setFriendRequestsData((prevRequests) =>
        prevRequests.filter((req) => req.requesterId !== requesterId)
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleCancelRequest = async (requesterId) => {
    if (!userId || !requesterId) return;

    try {
      await usersRepo.rejectFriendRequest(userId, requesterId);
      setFriendRequestsData((prevRequests) =>
        prevRequests.filter((req) => req.requesterId !== requesterId)
      );
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleSearch = async (e) => {
    const input = e.target.value;
    setSearchInput(input);

    if (input.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    try {
      const users = await usersRepo.getAllUsers();
      const usersExcludingCurrent = users.filter((user) => user.id !== userId);

      const filtered = usersExcludingCurrent.filter((user) =>
        user.name?.toLowerCase().includes(input.toLowerCase())
      );

      setAllUsers(usersExcludingCurrent);
      setFilteredUsers(filtered);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

  const handleSelectUser = (userId) => {
    setSearchInput("");
    setFilteredUsers([]);
    navigate(`/profile/${userId}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  if (isLoading && !userData) {
    return <LoadingModal />;
  }

  return (
    <header className="p-3 d-flex align-items-center justify-content-between">
      <div className="d-flex gap-3 align-items-center">
        <img src={logo} alt="Logo" />

        <Link title="Home" to={"/"} className="position-relative">
          <LiaHomeSolid className={styles.homeIcon} />
        </Link>

        <Link title="Chat" to={"/chat"} className="position-relative">
          <span className={styles.counter}>0</span>
          <FiMessageSquare className={styles.msgIcon} />
        </Link>

        <div className="btn-group dropup" id={styles.dropDown}>
          <span
            className={`${styles.counter} ${
              friendRequestsData.length > 0 ? styles.activeCounter : ""
            }`}
          >
            {friendRequestsData.length}
          </span>
          <LiaBellSolid
            data-bs-toggle="dropdown"
            aria-expanded="false"
            className={styles.notiIcon}
          />

          <ul className="dropdown-menu">
            {friendRequestsData.length === 0 ? (
              <li>
                <span className="dropdown-item">No new friend requests</span>
              </li>
            ) : (
              friendRequestsData.map((request, index) => (
                <li
                  key={request.requesterId || `friend-request-${index}`}
                  className={styles.requestItem}
                >
                  <div className="dropdown-item d-flex align-items-center gap-2">
                    <img
                      src={request.imgUrl || noImg}
                      alt={request.name || "User"}
                      className={styles.notificationUserImage}
                    />
                    <div>
                      <h6 className="m-0">{request.name || "Unknown User"}</h6>
                      <small className="text-muted">
                        Wants to be your friend
                      </small>
                    </div>
                  </div>
                  <div className="d-flex gap-2 p-3">
                    <button
                      className={`${styles.friendRequestBtn} ${styles.acceptBtn}`}
                      onClick={() => handleAcceptRequest(request.requesterId)}
                    >
                      <BsFillPersonCheckFill className={styles.friendRequest} />
                      Accept
                    </button>
                    <button
                      className={`${styles.friendRequestBtn} ${styles.rejectBtn}`}
                      onClick={() => handleCancelRequest(request.requesterId)}
                    >
                      <BsFillPersonXFill className={styles.friendRequest} />
                      Reject
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="d-flex gap-3 align-items-center position-relative">
        <div className="position-relative">
          <CiSearch className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Search"
            value={searchInput}
            onChange={handleSearch}
          />
          {filteredUsers.length > 0 && (
            <ul
              className="position-absolute bg-white border rounded p-2 mt-1 w-100"
              style={{ zIndex: 999 }}
            >
              {filteredUsers.map((user, index) => (
                <li
                  key={user.id || `filtered-user-${index}`}
                  className="d-flex align-items-center gap-2 p-1 hover-bg-light cursor-pointer"
                  onClick={() => handleSelectUser(user.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={user.imgUrl || noImg} />
                  <span>{user.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link className="position-relative" to="/cart">
          <span className={styles.counter}>0</span>
          <IoCartOutline className={styles.cartIcon} />
        </Link>

        <Dropdown
          userData={userData}
          onProfileClick={handleProfileClick}
          onLogoutClick={handleLogout}
        />
      </div>
    </header>
  );
}
