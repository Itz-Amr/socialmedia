import React, { useEffect, useState, useCallback } from "react";
import FriendsChat from "../Friends Chat";
import styles from "./index.module.css";
import { useAuthStore } from "../../Store/authStore";
import { usersRepo } from "../../Data/Apis/show_users";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuthStore();
  const userId = currentUser?.uid;

  const fetchFriends = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const userData = await usersRepo.getUserData(userId);
      const friendIds = Object.keys(userData?.friends || {});

      if (friendIds.length === 0) {
        setFriends([]);
        setFilteredFriends([]);
        setIsLoading(false);
        return;
      }

      // Process friends in batches to improve performance
      const batchSize = 10;
      const friendsData = [];

      for (let i = 0; i < friendIds.length; i += batchSize) {
        const batch = friendIds.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map((friendId) => usersRepo.getUserData(friendId))
        );
        friendsData.push(...batchResults.filter(Boolean));
      }

      setFriends(friendsData);
      setFilteredFriends(friendsData);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setError("Unable to load your friends. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFriends(friends);
      return;
    }

    const filtered = friends.filter((friend) =>
      friend.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFriends(filtered);
  }, [searchTerm, friends]);

  if (error) {
    return (
      <div
        className="col-12 h-100 d-flex flex-column p-3 align-items-center justify-content-center"
        id={styles.parent}
      >
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="col-12 gap-3 h-100 d-flex flex-column p-3"
      id={styles.parent}
    >
      <div
        className="d-flex align-items-center justify-content-between"
        id={styles.header}
      >
        <h6>Friends</h6>
      </div>

      <div>
        <input
          className="form-control"
          type="search"
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className={`d-flex flex-column overflow-auto ${styles.friendsList}`}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading friends...</p>
          </div>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <FriendsChat
              key={friend.id}
              chatId={friend.id}
              name={friend.name}
              imgUrl={friend.imgUrl}
            />
          ))
        ) : searchTerm ? (
          <p className={styles.emptyMessage}>No friends match your search</p>
        ) : (
          <p className={styles.emptyMessage}>No friends added yet</p>
        )}
      </div>
    </div>
  );
}
