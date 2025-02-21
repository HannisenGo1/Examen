import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  project_id: process.env['PROJECT_ID'],
  apiKey: process.env['API_KEY'],
  authDomain: process.env['AUTHDOMAIN'],
  storageBucket: process.env['STORAGEBUCKET'],
  messagingSenderId: process.env['MESSAGINGSENDERID'],
  appId: process.env['APPID'],
  measurementId: process.env['MEASUREMENTID'],
  projectId: process.env['PROJECT_ID']
}


// Initialize Firebase
const app = initializeApp(firebaseConfig) 
const db = getFirestore(app)
const auth = getAuth(app);
auth.useDeviceLanguage();


export {db, auth, app}