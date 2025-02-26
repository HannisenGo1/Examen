import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID
};

// Kontrollera om Firebase redan har initialiserats
// Om ingen app är initialiserad, skapa en ny instans
// Om Firebase redan är initialiserad, använd den existerande appen
let app;
if (getApps().length === 0) {

  app = initializeApp(firebaseConfig);
} else {

  app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);
auth.useDeviceLanguage();

export { db, auth, app };
