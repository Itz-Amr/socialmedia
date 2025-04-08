import { FaTemperatureHigh } from "react-icons/fa";
import styles from "./index.module.css";
import { CiLocationOn } from "react-icons/ci";

export default function Temperature() {
  return (
    <div className="p-3" id={styles.temp}>
      <div className="d-flex justify-content-between gap-3">
        <h6>Temperature</h6>
        <FaTemperatureHigh className={styles.icon} />
      </div>

      <div className="d-flex flex-row align-items-center justify-content-center gap-3">
        <p id={styles.uniq}>
          71 <span></span>
        </p>
      </div>

      <div>
        <p>Sunny</p>
      </div>

      <p>Sunday, 18th 2018</p>
      <div className="d-flex align-items-center justify-content-center">
        <CiLocationOn className={styles.icon} />
        <p>Cairo</p>
      </div>
    </div>
  );
}
