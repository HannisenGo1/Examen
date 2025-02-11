import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZLsOvCsMkWKjKRSVBXHY3buF3x4x5q5A",
  authDomain: "examen-e396b.firebaseapp.com",
  projectId: "examen-e396b",
  storageBucket: "examen-e396b.firebasestorage.app",
  messagingSenderId: "165780663174",
  appId: "1:165780663174:web:e3cbb1d27e25fb70385a07",
  measurementId: "G-65QHZP7V56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig) 
const db = getFirestore(app)
const auth = getAuth(app);
auth.useDeviceLanguage();
export const storage = getStorage(app);

export {db, auth, app}