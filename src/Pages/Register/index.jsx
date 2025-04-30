import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "./index.module.css";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import Swal from "sweetalert2";
import { useAuthStore } from "../../Store/authStore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import db from "../../FireBase";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const { loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleRegister = async (values) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: values.username,
      });

      // Directly create user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        name: values.username,
        email: values.email,
        imgUrl: null, // Or handle image upload separately
      });

      console.log("User registered and data saved to Firestore:", user);

      Swal.fire({
        icon: "success",
        title: "Registered successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/");
    } catch (error) {
      console.error("Error registering:", error.message);
      let errorMessage = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed up with Google:", user);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || "Google User",
          email: user.email || "",
          imgUrl: user.photoURL || null,
        });
        console.log("Google user data saved to Firestore:", user.uid);
      }

      Swal.fire({
        icon: "success",
        title: "Signed up with Google!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/");
    } catch (error) {
      console.error("Error with Google sign up:", error.message);
      Swal.fire({
        icon: "error",
        title: "Google Sign-Up Error",
        text: error.message,
      });
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(2, "Username must be at least 2 characters")
      .max(50, "Username cannot exceed 50 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <div
      className="col-12 h-100 d-flex flex-column align-items-center justify-content-center gap-3"
      id={styles.container}
    >
      <div>
        <h1>Create Account</h1>
        <p>Sign up to join our community!</p>
      </div>
      <Formik
        onSubmit={handleRegister}
        validationSchema={validationSchema}
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
      >
        <Form className="col-6 p-3 bg-white shadow rounded d-flex flex-column justify-content-center gap-4">
          {/* ... (rest of your form fields - username, email, password, confirmPassword) */}
          <div className={styles.inputContainer}>
            <Field
              name="username"
              type="text"
              className={styles.inputBar}
              placeholder=""
            />
            <label className={styles.inputLabel} htmlFor="styled_input_bar">
              Enter Your Username
            </label>
            <ErrorMessage
              name="username"
              component="div"
              className={styles.emailMsg} // Or a more specific class
            />
          </div>

          <div className={styles.inputContainer}>
            <Field
              name="email"
              type="email"
              className={styles.inputBar}
              placeholder=""
            />
            <label className={styles.inputLabel} htmlFor="styled_input_bar">
              Enter Your Email
            </label>
            <ErrorMessage
              name="email"
              component="div"
              className={styles.emailMsg}
            />
          </div>

          <div className={styles.inputContainer}>
            {showPass ? (
              <FaEye
                className={styles.eyeIcon}
                onClick={() => setShowPass(false)}
              />
            ) : (
              <FaEyeSlash
                className={styles.eyeIcon}
                onClick={() => setShowPass(true)}
              />
            )}
            <Field
              name="password"
              type={showPass ? "text" : "password"}
              className={styles.inputBar}
              placeholder=""
            />
            <label className={styles.inputLabel} htmlFor="styled_input_bar">
              Enter Your Password
            </label>
            <ErrorMessage
              name="password"
              component="div"
              className={styles.passwordMsg}
            />
          </div>

          <div className={styles.inputContainer}>
            {showPass ? (
              <FaEye
                className={styles.eyeIcon}
                style={{ top: "18px", right: "45px" }}
                onClick={() => setShowPass(false)}
              />
            ) : (
              <FaEyeSlash
                className={styles.eyeIcon}
                style={{ top: "18px", right: "45px" }}
                onClick={() => setShowPass(true)}
              />
            )}
            <Field
              name="confirmPassword"
              type={showPass ? "text" : "password"}
              className={styles.inputBar}
              placeholder=""
            />
            <label className={styles.inputLabel} htmlFor="styled_input_bar">
              Confirm Your Password
            </label>
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className={styles.passwordMsg}
            />
          </div>

          <button type="submit" className={styles.signInBtn}>
            Sign Up
          </button>

          <span className="col-12 text-center">or</span>

          <div className="d-flex justify-content-center">
            <button
              type="button"
              className={styles.btn}
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className={styles.googleIcon} /> Sign up with Google
            </button>
          </div>

          <p className="col-12 text-center">
            Already have an account?{" "}
            <Link to="/login" className={styles.signUp}>
              Log in
            </Link>
          </p>
        </Form>
      </Formik>
    </div>
  );
}
