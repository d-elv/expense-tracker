// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// import these and export them below
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2tIDBoQQZxskj-_QAaQpQ9tVPELkiWX4",
  authDomain: "expense-tracker-a8996.firebaseapp.com",
  projectId: "expense-tracker-a8996",
  storageBucket: "expense-tracker-a8996.appspot.com",
  messagingSenderId: "558931017166",
  appId: "1:558931017166:web:eadf336e94b47ae41fff9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export these after importing them for auth.jsx
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider();
// exports reference to database within code
export const db = getFirestore();
// firebase login
// firebase init
// firebase deploy