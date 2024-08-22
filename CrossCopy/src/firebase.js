// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  signInAnonymously,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database'; // Import the functions for Realtime Database
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  addDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import the function for Firebase Storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCQtBsg52CdbJcPMIOi6qKG9gtTFJLXVyk',
  authDomain: 'crosscopy-72ed9.firebaseapp.com',
  databaseURL: 'https://crosscopy-72ed9-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'crosscopy-72ed9',
  storageBucket: 'crosscopy-72ed9.appspot.com',
  messagingSenderId: '151172836372',
  appId: '1:151172836372:web:655500aa152f52de1dcb01',
  measurementId: 'G-5VLJDH79KS',
};

export const Signout = (message) => {
  if (window.confirm(String(message))) {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Successfully signed out...');
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  }
};

export const resetPassword = (email) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return new Promise((resolve, reject) => {
    if (emailRegex.test(email)) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          console.log('Password reset email sent!');
          resolve(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          console.log('Error code:', errorCode);
          console.log('Error message:', errorMessage);
          resolve(false);
        });
    } else {
      console.log('Invalid email format');
      resolve(false);
    }
  });
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app); // Initialize the Realtime Database
const storage = getStorage(app); // Initialize Firebase Storage
const firestore = getFirestore(app);

const RECAPTCHA = import.meta.env.VITE_RECAPTCHA;

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(RECAPTCHA),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

export const trackShare = async (page) => {
  logEvent(analytics, 'view_page', {
    content_type: 'web_page',
    content_id: page,
  });
};

export const trackViews = async (page) => {
  logEvent(analytics, 'view_page', {
    content_type: 'web_page',
    content_id: page,
  });
};

export const trackButtonClick = async (buttonName) => {
  logEvent(analytics, 'select_content', {
    content_type: 'button',
    content_id: buttonName,
  });

  const buttonRef = doc(firestore, 'buttons', buttonName);

  // Increment totalClicks
  await updateDoc(buttonRef, {
    totalClicks: increment(1),
  });

  // Add a new document to the clicks subcollection with the current timestamp
  const clicksCollectionRef = collection(buttonRef, 'clicks');
  await addDoc(clicksCollectionRef, {
    timestamp: serverTimestamp(),
  });
};

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
  database,
  firestore,
  ref,
  set,
  onValue,
  remove,
  storage,
  query,
};
