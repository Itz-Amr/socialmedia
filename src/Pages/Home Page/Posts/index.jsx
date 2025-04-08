import styles from "./index.module.css";
import user from "../../../assets/user.jpg";
import { CiShare2 } from "react-icons/ci";
import { LiaCommentAlt, LiaHeart } from "react-icons/lia";
export default function Posts() {
  return (
    <div className="p-3 d-flex flex-column gap-3" id={styles.parnet}>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img src={user} alt="" />

          <h6>Ali Ahmed</h6>
        </div>

        <div>
          <span>July 26 2018, 01:03pm</span>
        </div>
      </div>

      <div className={styles.content}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab sint quasi
          ea est voluptates libero reprehenderit sed quae tempora laborum? Odio
          nihil porro sunt sapiente hic libero cum, nesciunt nobis.
        </p>
      </div>

      <div className="d-flex justify-content-between">
        <button>
          <LiaHeart className={styles.icon} />
          Like
        </button>

        <button>
          <LiaCommentAlt className={styles.icon} />
          Comment
        </button>

        <button>
          <CiShare2 className={styles.icon} />
          Send
        </button>
      </div>
    </div>
  );
}
