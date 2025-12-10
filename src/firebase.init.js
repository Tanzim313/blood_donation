// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAszuUiAvd7vCjhRbQTuP9eKMdKX487FmM",
  authDomain: "blood-donation-59a32.firebaseapp.com",
  projectId: "blood-donation-59a32",
  storageBucket: "blood-donation-59a32.firebasestorage.app",
  messagingSenderId: "577987086572",
  appId: "1:577987086572:web:c57d55bef291ff49133dc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);