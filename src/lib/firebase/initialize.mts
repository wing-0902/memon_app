// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0hfm4N_v6osDnf7bKFd6dwMXxDvqZmKU",
  authDomain: "memon-756fd.firebaseapp.com",
  projectId: "memon-756fd",
  storageBucket: "memon-756fd.firebasestorage.app",
  messagingSenderId: "166752473168",
  appId: "1:166752473168:web:9d3b00c9652db4ad458155",
  databaseURL: "https://memon-756fd-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };