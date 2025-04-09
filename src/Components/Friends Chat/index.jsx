import styles from "./index.module.css";

export default function FriendsChat({ name, imgUrl }) {
  return (
    <div
      className="d-flex align-items-center justify-content-start flex-row gap-3"
      id={styles.parent}
    >
      <img src={imgUrl} alt="" />
      <h6>{name}</h6>
    </div>
  );
}
