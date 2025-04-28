import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "./index.module.css";
import * as Yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmite = (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        navigate("/");
      })
      .catch((error) => {
        let errorMessage = "";

        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "This email is not registered.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many attempts, please try again later.";
            break;
          default:
            errorMessage = "An unexpected error occurred.";
        }

        Swal.fire({
          icon: "error",
          title: "Email or password is incorrect",
        });
      });
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
        <h1>Welcome Back !</h1>
        <p>Please, Sign in to continue</p>
      </div>
      <Formik
        onSubmit={handleSubmite}
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
              component={"div"}
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
              component={"div"}
              className={styles.passwordMsg}
            />
          </div>

          <button type="submit" className={styles.signInBtn}>
            Sign in
          </button>

          <span className="col-12 text-center">or</span>

          <div className="d-flex justify-content-center">
            <button type="button" className={styles.btn}>
              <FcGoogle className={styles.googleIcon} /> Sign up with Google
            </button>
          </div>

          <Link className="text-decoration-none col-12 text-center">
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
