import { collection, getDocs, getDoc, addDoc, query, deleteDoc, updateDoc, where, doc } from "firebase/firestore/lite";
import { db } from "./firebase.js";
const userCollection = collection(db, "users");
export async function GetUser() {
    try {
        const snapshot = await getDocs(userCollection);
        return snapshot.docs.map((doc) => withKey(doc));
    }
    catch (error) {
        console.error("Fel vid hämtning av användare:", error);
        return [];
    }
}
export async function AddUser(data) {
    try {
        const docRef = await addDoc(userCollection, data);
        return docRef.id;
    }
    catch (error) {
        console.error("Fel vid skapande av användare:", error);
        throw error;
    }
}
export async function UpdateUser(userId, updatedData) {
    try {
        const userDoc = doc(db, "users", userId);
        const userSnap = await getDoc(userDoc);
        if (!userSnap.exists()) {
            throw new Error("Användaren hittades inte.");
        }
        await updateDoc(userDoc, updatedData);
        console.log("Användardata uppdaterad!");
    }
    catch (error) {
        console.error("Fel vid uppdatering av användare:", error);
        throw error;
    }
}
export async function GetUserByNameOrEmail(email) {
    try {
        const emailQuery = query(userCollection, where("email", "==", email));
        const emailSnapshot = await getDocs(emailQuery);
        if (!emailSnapshot.empty) {
            return { email: true };
        }
        return null;
    }
    catch (error) {
        console.error("Fel vid sökning av användare:", error);
        throw new Error("Fel vid sökning av användare");
    }
}
export async function GetUserById(userId) {
    const userDoc = doc(db, "users", userId);
    const snapshot = await getDoc(userDoc);
    if (!snapshot.exists()) {
        throw new Error("Användaren hittades inte.");
    }
    return { id: snapshot.id, ...snapshot.data() };
}
export async function DeleteUser(usersId) {
    try {
        const user = doc(db, "users", usersId);
        await deleteDoc(user);
    }
    catch (error) {
        console.error("Fel vid borttagning av användare:", error);
        throw error;
    }
}
export function withKey(doc) {
    const data = doc.data();
    return { ...data, id: doc.id };
}
