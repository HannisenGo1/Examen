import { getDoc, doc, setDoc, getFirestore, deleteDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser, } from "firebase/auth";
import { useUserStore } from "../../storage/storage";
const db = getFirestore();
//Firebase Authentication för registering av en användare
export const doSignUpWithEmailAndPassword = async (formData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            id: user.uid,
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
            hasUsedPromoCode: formData.hasUsedPromoCode,
            createdAt: new Date()
        });
        return true;
    }
    catch (error) {
        return error.message;
    }
};
//  Logga in med Firebase Auth -> email och lösenord
export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            useUserStore.getState().setUser({
                id: user.uid,
                firstName: userData.firstName || "Okänd",
                lastName: userData.lastName || "Ej angivet",
                email: userData.email || "",
                age: userData.age || 0,
                city: userData.city || "Ej angivet",
                gender: userData.gender || "Ej angivet",
                sexualOrientation: userData.sexualOrientation || "Ej angivet",
                religion: userData.religion || "Ej angivet",
                interests: userData.interests || [],
                hasChildren: userData.hasChildren || false,
                wantsChildren: userData.wantsChildren || false,
                smokes: userData.smokes || "Ej angivet",
                relationshipStatus: userData.relationshipStatus || "Ej angivet",
                education: userData.education || "Ej angivet",
                favoriteSong: userData.favoriteSong || "Ej angivet",
                favoriteMovie: userData.favoriteMovie || "Ej angivet",
                lifeStatement1: userData.lifeStatement1 || "Ej angivet",
                lifeStatement2: userData.lifeStatement2 || "Ej angivet",
                ommig: userData.ommig || "Ej angivet",
                credits: userData.credits || 0,
                purchasedEmojis: userData.purchasedEmojis || [],
                vipStatus: userData.vipStatus || false,
                vipExpiry: userData.vipExpiry || null,
                vipPlusStatus: userData.vipPlusStatus || false,
                hasUsedPromoCode: userData.hasUsedPromoCode || false,
                purchaseEmoji: (emoji, cost) => {
                },
                updateUser: (updatedFields) => {
                },
                addCredits: (amount) => {
                },
            });
            return { ...userData, id: user.uid };
        }
        else {
            console.error("Användardata finns inte i Firestore");
            throw new Error("Användardata finns inte i Firestore.");
        }
    }
    catch (error) {
        console.error(" Inloggning misslyckades:", error.message);
        return error.message;
    }
};
// Radera  konto 
// Be användaren att logga in igen om Firebase kräver det
export async function DeleteUser(usersId) {
    try {
        const user = auth.currentUser;
        if (!user || user.uid !== usersId) {
            throw new Error("Ingen användare inloggad");
        }
        const email = user.email;
        if (!email) {
            throw new Error("Kan inte hämta e-postadress.");
        }
        const password = ("Ange ditt lösenord för att radera ditt konto:");
        if (!password) {
            return;
        }
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(user, credential);
        // Radera användaren från collection
        // Radera användaren från Authentication
        const userDoc = doc(db, "users", usersId);
        await deleteDoc(userDoc);
        await deleteUser(user);
    }
    catch (error) {
        console.error("Fel vid borttagning av användare:", error);
        throw error;
    }
}
export const doSignOut = () => {
    return auth.signOut();
};
export const doPasswordReset = (password) => {
    if (auth.currentUser) {
        return updatePassword(auth.currentUser, password);
    }
    return Promise.reject(new Error("No current user"));
};
export const doSendEmailVerification = async () => {
    if (!auth.currentUser) {
        return Promise.reject(new Error("No current user"));
    }
    if (auth.currentUser?.emailVerified) {
        return;
    }
    try {
        await sendEmailVerification(auth.currentUser);
    }
    catch (error) {
        if (error instanceof FirebaseError) {
            if (error.code === 'auth/too-many-requests') {
                await sendEmailVerification(auth.currentUser);
            }
            else {
                console.error("Error sending email verification:", error.message);
                throw error;
            }
        }
        else {
            console.error("Unknown error:", error);
            throw error;
        }
    }
};
export const retrySendVerificationEmail = async (user, retries = 3) => {
    try {
        await sendEmailVerification(user);
    }
    catch (error) {
        if (error instanceof FirebaseError) {
            console.error("Error sending email verification:", error.message);
            if (error.code === 'auth/too-many-requests' && retries > 0) {
            }
            throw error;
        }
        else {
            console.error('Unknown error:', error);
            throw error;
        }
    }
};
