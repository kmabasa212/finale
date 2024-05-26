import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {  getAuth, GoogleAuthProvider  } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js"
import {
  getStorage,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js';



const firebaseConfig = {
    apiKey: "AIzaSyD-4HV9w6vG-y6QGrIxgn8F10s7ugLcHYo",
    authDomain: "login-with-firebase-data-d447f.firebaseapp.com",
    projectId: "login-with-firebase-data-d447f",
    storageBucket: "login-with-firebase-data-d447f.appspot.com",
    messagingSenderId: "972550034552",
    appId: "1:972550034552:web:2fa6da4f5f6a7825d9098d"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//create google instance
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const storage = getStorage();

// Initialize Realtime Database and get a reference to the service

export { db, auth, provider, firebaseConfig , storage , getAuth};