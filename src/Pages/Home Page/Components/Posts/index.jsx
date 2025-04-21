import styles from "./index.module.css";
import user from "../../../../assets/user.jpg";
import { CiShare2 } from "react-icons/ci";
import { LiaCommentAlt, LiaHeart } from "react-icons/lia";
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
} from "firebase/firestore";
import { LuSend } from "react-icons/lu";
import CommentsModal from "../../../../Components/Comments Modal";
import { useCommentModal } from "../../../../Store";
import LoadingModal from "../../../../Components/Loading Modal";
import { FaHeart } from "react-icons/fa";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [userLikedPosts, setUserLikedPosts] = useState({});
  const { commentsModal } = useCommentModal();
  const { openCommentsModal } = useCommentModal();
  const userId = "userId"; // Replace with actual user ID from your authentication

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("dateAndTime", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        documentId: doc.id,
      }));
      setPosts(postData);

      postData.forEach((post) => {
        const commentsRef = collection(db, `posts/${post.documentId}/comments`);
        const likesRef = collection(db, `posts/${post.documentId}/likes`);

        // Fetch comments count
        const unsubscribeComments = onSnapshot(
          commentsRef,
          (commentSnapshot) => {
            setCommentsCount((prevComments) => ({
              ...prevComments,
              [post.documentId]: commentSnapshot.size,
            }));
          }
        );

        // Fetch likes count and check if the user liked the post
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
  }, []);

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

  if (posts.length === 0) {
    return <LoadingModal />;
  }

  return (
    <div className="d-flex flex-column gap-3" id={styles.parnet}>
      {posts.map((el) => (
        <div
          className="d-flex flex-column gap-3 p-3 border rounded bg-white shadow-sm"
          key={el.documentId}
        >
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <img src={user} alt="" />
              <h6>Ali Ahmed</h6>
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
            <div className="d-flex gap-3">
              <button onClick={() => handleLike(el.documentId)}>
                <FaHeart
                  className={styles.icon}
                  style={{
                    color: userLikedPosts[el.documentId] ? "red" : "white",
                  }}
                />
                <span className="position-absolute" id={styles.counter}>
                  {likesCount[el.documentId] || 0}
                </span>
              </button>

              <button onClick={() => openCommentsModal(el.documentId)}>
                <LiaCommentAlt className={styles.icon} />
                <span className="position-absolute" id={styles.counter}>
                  {commentsCount[el.documentId] || 0}
                </span>
              </button>
            </div>

            <button>
              <LuSend className={styles.icon} />
            </button>
          </div>

          {commentsModal && <CommentsModal />}
        </div>
      ))}
    </div>
  );
}
