// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIIREBASE_API_KEY,
  authDomain: "mern-blog-78dc8.firebaseapp.com",
  projectId: "mern-blog-78dc8",
  storageBucket: "mern-blog-78dc8.appspot.com",
  messagingSenderId: "580450623158",
  appId: "1:580450623158:web:1f1b5ef5efc59e6603d017"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);