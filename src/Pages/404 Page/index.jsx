import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";

export default function ErrorPage() {
  const navigate = useNavigate();
  const handleGoBackToDashBoard = () => {
    navigate("/");
  };
  return (
    <div className={styles.pageContainer}>
      <div>
        <h1 className={styles.glitch} data-glitch="404">
          404
        </h1>
      </div>
      <button onClick={handleGoBackToDashBoard} className="btn btn-danger z-3">
        Go To DashBoard
      </button>
    </div>
  );
}
