import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import "./auth.css";

export const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);
    // the user info that we want to keep recorded as an object
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    };
    // set localstorage so the login stays consistent even after refreshes / closing tabs
    localStorage.setItem("auth", JSON.stringify(authInfo)); // you can't set localstorage as an object, so use JSON.stringify, we can turn this back into an object later.
    // navigates from the auth page to the main expense-tracker app.
    navigate("/expense-tracker");
  };

  if (isAuth) {
    return <Navigate to="/expense-tracker" />;
  }

  return (
    <div className="login-page">
      <p>Sign In With Google to Continue</p>
      <button className="login-with-google-button" onClick={signInWithGoogle}>
        {" "}
        Sign In With Google
      </button>
    </div>
  );
};
