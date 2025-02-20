import { getDoc, doc, setDoc, getFirestore  } from "firebase/firestore";
import { auth } from "../../data/firebase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword,
 sendEmailVerification, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
 const db = getFirestore()

 //Firebase Authentication

  
  export const doSignUpWithEmailAndPassword = async (formData: any) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);

        await setDoc(userDocRef, { 
            uid: user.uid,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            age: formData.age,
            city: formData.city,
            gender: formData.gender,
            sexualOrientation: formData.sexualOrientation,
            religion: formData.religion,
            interests: formData.interests,
            hasChildren: formData.hasChildren,
            wantsChildren: formData.wantsChildren,
            smokes: formData.smokes,
            relationshipStatus: formData.relationshipStatus,
            education: formData.education,
            favoriteSong: formData.favoriteSong,
            favoriteMovie: formData.favoriteMovie,
            lifeStatement1: formData.lifeStatement1,
            lifeStatement2: formData.lifeStatement2,
            ommig: formData.ommig,
            createdAt: new Date()
        });

        console.log(" Användare registrerad & sparad i Firestore!");
        return true;
    } catch (error: any) {
        console.error("registreringen gick inte igenom:", error.message);
        return error.message;
    }
};
  
    //  Logga in användaren med Firebase Authentication
export const doSignInWithEmailAndPassword = async (email: string, password: string) => {
    try {
    
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("✅ Inloggning lyckades! Användardata:", userData);
            return { ...userData, uid: user.uid }; 
        } else {
            throw new Error("Användarens data finns inte i Firestore.");
        }
    } catch (error: any) {
        console.error("❌ Inloggning misslyckades:", error.message);
        return error.message;
    }
};



  export const doSignOut = (): Promise<void> => {
    return auth.signOut();
  };
  
  export const doPasswordReset = (password: string): Promise<void> => {
    if (auth.currentUser) {
      return updatePassword(auth.currentUser, password);
    }
    return Promise.reject(new Error("No current user"));
  };
  
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  export const doSendEmailVerification = async (): Promise<void> => {
    if (!auth.currentUser) {
      return Promise.reject(new Error("No current user"));
    }
  
    if (auth.currentUser?.emailVerified) {
      return;
    }
  
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/too-many-requests') {
          await delay(60000);  
          await sendEmailVerification(auth.currentUser);
        } else {
          console.error("Error sending email verification:", error.message);
          throw error; 
        }
      } else {
        console.error("Unknown error:", error);
        throw error;  
      }
    }
  };
  
  export const retrySendVerificationEmail = async (user: any, retries: number = 3, delay: number = 2000): Promise<void> => {
    try {
      await sendEmailVerification(user);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Error sending email verification:", error.message);
        if (error.code === 'auth/too-many-requests' && retries > 0) {
          console.warn(`Too many requests, retrying in ${delay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          await retrySendVerificationEmail(user, retries - 1, delay * 2);
        }
        throw error;
      } else {
        console.error('Unknown error:', error);
        throw error;
      }
    }
  };