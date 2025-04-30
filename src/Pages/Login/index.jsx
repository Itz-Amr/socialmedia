import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "./index.module.css";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Swal from "sweetalert2";
import { useAuthStore } from "../../Store/authStore";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const { currentUser, loading } = useAuthStore(); // Get current authenticated user and loading state

  // Show loading indicator while auth state is being determined
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is already logged in, redirect to home page
  if (currentUser) {
    console.log("User already logged in, redirecting to home");
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (values) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      console.log("User signed in:", user);

      Swal.fire({
        icon: "success",
        title: "Signed in successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error.message);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in with Google:", user);

      Swal.fire({
        icon: "success",
        title: "Signed in with Google!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/");
    } catch (error) {
      console.error("Error with Google sign in:", error.message);

      Swal.fire({
        icon: "error",
        title: "Google Sign-In Error",
        text: error.message,
      });
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div
      className="col-12 h-100 d-flex flex-column align-items-center justify-content-center gap-3"
      id={styles.container}
    >
      <div>
        <h1>Welcome Back!</h1>
        <p>Please, Sign in to continue</p>
      </div>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        initialValues={{ email: "", password: "" }}
      >
        <Form className="col-6 p-3 bg-white shadow rounded d-flex flex-column justify-content-center gap-4">
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

          <button type="submit" className={styles.signInBtn}>
            Sign in
          </button>

          <span className="col-12 text-center">or</span>

          <div className="d-flex justify-content-center">
            <button
              type="button"
              className={styles.btn}
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className={styles.googleIcon} /> Sign in with Google
            </button>
          </div>

          <Link
            to="/forgot-password"
            className="text-decoration-none col-12 text-center"
          >
            Forgot password?
          </Link>
        </Form>
      </Formik>

      <p className="col-12 text-center">
        Don't have an account?{" "}
        <Link to="/register" className={styles.signUp}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
