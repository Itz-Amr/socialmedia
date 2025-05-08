import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { LiaCommentAlt } from "react-icons/lia";
import { CiShare2 } from "react-icons/ci";
import { BiSolidLike } from "react-icons/bi";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { useCommentModal } from "../../../../Store";
import LoadingModal from "../../../../Components/Loading Modal";
import db from "../../../../FireBase";
import CommentsModal from "../../../../Components/Comments Modal";
import { useAuthStore } from "../../../../Store/authStore";
import { FaUserCircle } from "react-icons/fa";

export default function UserPosts({ profileUserId }) {
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likesCount, setLikesCount] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [userLikedPosts, setUserLikedPosts] = useState({});
  const { currentUser } = useAuthStore();
  const currentLoggedInUserId = currentUser?.uid;
  const { commentsModal, openCommentsModal } = useCommentModal();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", profileUserId));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData({});
        }

        // Fetch posts
        const q = query(
          collection(db, "posts"),
          where("userId", "==", profileUserId),
          orderBy("dateAndTime", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const userPosts = snapshot.docs.map((doc) => ({
            ...doc.data(),
            documentId: doc.id,
          }));
          setPosts(userPosts);

          // Reset counts
          setCommentsCount({});
          setLikesCount({});
          setUserLikedPosts({});

          // Listeners for each post
          userPosts.forEach((post) => {
            const commentsRef = collection(
              db,
              `posts/${post.documentId}/comments`
            );
            const likesRef = collection(db, `posts/${post.documentId}/likes`);

            // Listen comments
            onSnapshot(commentsRef, (commentSnapshot) => {
              setCommentsCount((prev) => ({
                ...prev,
                [post.documentId]: commentSnapshot.size,
              }));
            });

            // Listen likes
            onSnapshot(likesRef, (likeSnapshot) => {
              setLikesCount((prev) => ({
                ...prev,
                [post.documentId]: likeSnapshot.size,
              }));

              const liked = likeSnapshot.docs.some(
                (doc) => doc.id === currentLoggedInUserId
              );
              setUserLikedPosts((prev) => ({
                ...prev,
                [post.documentId]: liked,
              }));
            });
          });

          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileUserId, currentLoggedInUserId]);

  const handleLike = async (postId) => {
    if (!currentLoggedInUserId) {
      console.warn("User not logged in, cannot like post.");
      return;
    }
    const likeRef = doc(db, `posts/${postId}/likes/${currentLoggedInUserId}`);
    const alreadyLiked = userLikedPosts[postId];

    if (alreadyLiked) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, { likedAt: new Date() });
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (isLoading) {
    return <LoadingModal />;
  }

  if (posts.length === 0) {
    return (
      <div
        className="p-3 col-12 bg-white d-flex flex-column align-items-center justify-content-center"
        id={styles.body}
      >
        <p>No posts yet</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <div
          key={post.documentId}
          className="p-3 col-12 bg-white d-flex flex-column gap-3"
          id={styles.body}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              {userData.imgUrl ? (
                <img src={userData?.imgUrl} alt="" />
              ) : (
                <FaUserCircle className="fs-2" />
              )}
              <h5 className="m-0 fw-bold">
                {userData?.name || "Unknown User"}
              </h5>
            </div>
          </div>

          <div className={styles.content}>
            <p>{post.content}</p>
          </div>

          <div className="d-flex justify-content-between">
            <button
              style={{
                color: userLikedPosts[post.documentId] ? "#0566ff" : "#757a91",
              }}
              onClick={() => handleLike(post.documentId)}
              disabled={!currentLoggedInUserId}
            >
              <BiSolidLike
                style={{
                  color: userLikedPosts[post.documentId]
                    ? "#0566ff"
                    : "#757a91",
                }}
                className={styles.icon}
              />
              Like
              <span className="position-absolute" id={styles.counter}>
                {likesCount[post.documentId] || 0}
              </span>
            </button>

            <button onClick={() => openCommentsModal(post.documentId)}>
              <LiaCommentAlt className={styles.icon} />
              Comments
              <span className="position-absolute" id={styles.counter}>
                {commentsCount[post.documentId] || 0}
              </span>
            </button>

            <button>
              <CiShare2 className={styles.icon} />
              Share
            </button>
          </div>

          {commentsModal && <CommentsModal />}
        </div>
      ))}
    </>
  );
}
