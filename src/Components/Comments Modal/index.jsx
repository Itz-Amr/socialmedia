import { useState, useEffect } from "react";
import { useCommentModal } from "../../Store";
import styles from "./index.module.css";
import db from "../../FireBase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  getDoc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { FaClock, FaRegTrashAlt, FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { useAuthStore } from "../../Store/authStore";

export default function CommentsModal() {
  const { closeCommentsModal, selectedPostId } = useCommentModal();
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [commentUsers, setCommentUsers] = useState({});
  const { currentUser } = useAuthStore();
  const userId = currentUser?.uid;

  useEffect(() => {
    if (!selectedPostId) return;

    const q = query(
      collection(db, `posts/${selectedPostId}/comments`),
      orderBy("dateAndTime")
    );
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const allComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommentsList(allComments);

      // Fetch user data for each comment if not already fetched
      const userPromises = allComments.map(async (comment) => {
        if (comment.userId && !commentUsers[comment.userId]) {
          try {
            const userDoc = await getDoc(doc(db, "users", comment.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setCommentUsers((prevUsers) => ({
                ...prevUsers,
                [comment.userId]: {
                  name: userData.name || "Unknown User",
                  imgUrl: userData.imgUrl || "",
                },
              }));
            }
          } catch (error) {
            console.error("Error fetching comment user data:", error);
          }
        }
      });
      await Promise.all(userPromises);
    });

    return () => unsubscribe();
  }, [selectedPostId]);

  // Add Comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() === "") return;

    if (userId) {
      try {
        await addDoc(collection(db, "posts", selectedPostId, "comments"), {
          text: comment,
          dateAndTime: new Date(),
          userId: userId, // Use the current user ID
        });
        setComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    } else {
      console.log("User is not logged in.");
    }
  };

  // Delete Comment
  const handleDelete = async (commentId) => {
    if (!selectedPostId || !commentId) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "posts", selectedPostId, "comments", commentId));
    }
  };

  return (
    <div
      className="col-12 h-100 position-fixed d-flex align-items-center justify-content-center"
      id={styles.body}
      onClick={closeCommentsModal}
    >
      <div
        className="col-7 h-75 bg-white rounded p-3 d-flex flex-column"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="mb-3">Comments</h4>

        <div className="flex-grow-1 overflow-auto mb-3">
          {commentsList.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center">
              <p className="text-center fw-bold">No comments yet</p>
            </div>
          ) : (
            commentsList.map((el) => {
              const commenterInfo = commentUsers[el.userId] || {
                name: "Unknown User",
                imgUrl: "",
              };
              return (
                <div
                  key={el.id}
                  className="d-flex flex-column gap-2 border-bottom"
                >
                  <div className="d-flex py-3 justify-content-between align-items-center position-relative">
                    <div className="d-flex align-items-center gap-2">
                      {commenterInfo.imgUrl ? (
                        <img src={commenterInfo.imgUrl} alt="" />
                      ) : (
                        <FaUserCircle size={24} />
                      )}
                      <strong>{commenterInfo.name}</strong>
                    </div>
                    {el.userId === userId && (
                      <FaRegTrashAlt
                        className={styles.deleteIcon}
                        onClick={() => handleDelete(el.id)}
                        title="Delete comment"
                      />
                    )}

                    <p>
                      <FaClock />
                      {el.dateAndTime?.seconds
                        ? formatDistanceToNow(
                            new Date(el.dateAndTime.seconds * 1000),
                            { addSuffix: true }
                          )
                        : "No date"}
                    </p>
                  </div>

                  <span>{el.text}</span>
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            className="p-2 flex-grow-1"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" disabled={!userId}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
