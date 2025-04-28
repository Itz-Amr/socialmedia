import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import styles from "./index.module.css";
import db from "../../FireBase";

export default function EditUserInfoModal({
  initialInfo,
  onClose,
  profileUserId,
  onSaveSuccess,
}) {
  const [formData, setFormData] = useState(initialInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(initialInfo);
  }, [initialInfo]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    //  validation
    if (
      !formData.studiedAt ||
      !formData.marriedTo ||
      !formData.from ||
      !formData.livesIn
    ) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userDocRef = doc(db, "users", profileUserId);

      await updateDoc(userDocRef, formData);

      onSaveSuccess();

      onClose();
    } catch (error) {
      setError("Error updating profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Edit Basic Info</h3>
        <div className={styles.modalBody}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="studiedAt">Studied at:</label>
            <input
              type="text"
              id="studiedAt"
              value={formData.studiedAt}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="marriedTo">Married to:</label>
            <input
              type="text"
              id="marriedTo"
              value={formData.marriedTo}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="from">From:</label>
            <input
              type="text"
              id="from"
              value={formData.from}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="livesIn">Lives in:</label>
            <input
              type="text"
              id="livesIn"
              value={formData.livesIn}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
