import styles from "./index.module.css";
import { LiaCommentAlt } from "react-icons/lia";
import { useEffect, useState } from "react";
import db from "../../../../FireBase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { LuSend } from "react-icons/lu";
import CommentsModal from "../../../../Components/Comments Modal";
import { useCommentModal } from "../../../../Store";
import LoadingModal from "../../../../Components/Loading Modal";
import { BiSolidLike } from "react-icons/bi";
import { curretUserId } from "../../../../Store";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [userLikedPosts, setUserLikedPosts] = useState({});
  const { commentsModal } = useCommentModal();
  const { openCommentsModal } = useCommentModal();
  const userId = curretUserId;
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("dateAndTime", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        documentId: doc.id,
      }));
      setPosts(postData);

      // Fetch user data for each post
      const userPromises = postData.map(async (post) => {
        if (post.userId && !users[post.userId]) {
          try {
            const userDoc = await getDoc(doc(db, "users", post.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUsers((prev) => ({
                ...prev,
                [post.userId]: {
                  name: userData.name || "Unknown User",
                  imgUrl: userData.imgUrl || "/default-avatar.jpg",
                },
              }));
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      });

      await Promise.all(userPromises);

      postData.forEach((post) => {
        const commentsRef = collection(db, `posts/${post.documentId}/comments`);
        const likesRef = collection(db, `posts/${post.documentId}/likes`);

        // Comments listener
        const unsubscribeComments = onSnapshot(
          commentsRef,
          (commentSnapshot) => {
            setCommentsCount((prevComments) => ({
              ...prevComments,
              [post.documentId]: commentSnapshot.size,
            }));
          }
        );

        // Likes listener
        const unsubscribeLikes = onSnapshot(likesRef, (likeSnapshot) => {
          setLikesCount((prevLikes) => ({
            ...prevLikes,
            [post.documentId]: likeSnapshot.size,
          }));

          const liked = likeSnapshot.docs.some((doc) => doc.id === userId);
          setUserLikedPosts((prevLikes) => ({
            ...prevLikes,
            [post.documentId]: liked,
          }));
        });

        return () => {
          unsubscribeComments();
          unsubscribeLikes();
        };
      });
    });

    return () => unsubscribe();
  }, [userId, users, openCommentsModal]);

  const handleLike = async (postId) => {
    const likeRef = doc(db, `posts/${postId}/likes/${userId}`);
    const alreadyLiked = userLikedPosts[postId];

    if (alreadyLiked) {
      await deleteDoc(likeRef);
    } else {
      await setDoc(likeRef, { likedAt: new Date() });
    }

    setUserLikedPosts((prev) => ({
      ...prev,
      [postId]: !alreadyLiked,
    }));
  };

  const goToUserProfile = (profileId) => {
    navigate(`/profile/${profileId}`);
  };

  if (posts.length === 0) {
    return <LoadingModal />;
  }

  return (
    <div className="d-flex flex-column flex-grow-1 gap-3" id={styles.parnet}>
      {posts.map((el) => {
        const userInfo = users[el.userId] || {
          name: "Unknown User",
          imgUrl: "/default-avatar.jpg",
        };

        return (
          <div
            className="d-flex flex-column gap-3 p-3 border rounded bg-white shadow-sm"
            key={el.documentId}
          >
            <div className="d-flex justify-content-between">
              <div
                className="d-flex align-items-center gap-2"
                style={{ cursor: "pointer" }}
                onClick={() => goToUserProfile(el.userId)}
              >
                <img src={userInfo.imgUrl} alt="" />
                <h6>{userInfo.name}</h6>
              </div>

              <div>
                <span>
                  {el.dateAndTime?.seconds
                    ? new Date(el.dateAndTime.seconds * 1000).toLocaleString()
                    : "no date"}
                </span>
              </div>
            </div>

            <div className={styles.content}>
              <p>{el.content}</p>
            </div>

            <div className="d-flex justify-content-between">
              <button
                style={{
                  color: userLikedPosts[el.documentId] ? "#0566ff" : "black",
                }}
                onClick={() => handleLike(el.documentId)}
              >
                <BiSolidLike
                  style={{
                    color: userLikedPosts[el.documentId] ? "#0566ff" : "black",
                  }}
                  className={styles.icon}
                />
                Like
                <span className="position-absolute" id={styles.counter}>
                  {likesCount[el.documentId] || 0}
                </span>
              </button>

              <button onClick={() => openCommentsModal(el.documentId)}>
                <LiaCommentAlt className={styles.icon} />
                Comments
                <span className="position-absolute" id={styles.counter}>
                  {commentsCount[el.documentId] || 0}
                </span>
              </button>

              <button>
                <LuSend className={styles.icon} />
                Share
                <span className="position-absolute" id={styles.counter}>
                  0
                </span>
              </button>
            </div>

            {commentsModal && <CommentsModal />}
          </div>
        );
      })}
    </div>
  );
}
