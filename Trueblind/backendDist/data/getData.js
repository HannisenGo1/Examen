import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore/lite";
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
// Uppdatera en jobbannons
export async function UpdateUser(userId, data) {
    try {
        const assignmentDoc = doc(db, "users", userId);
        await updateDoc(assignmentDoc, data);
    }
    catch (error) {
        console.error("Fel vid uppdatering av jobbannons:", error);
        throw error;
    }
}
// Ta bort en jobbannons
export async function DeleteUser(usersId) {
    try {
        const assignmentDoc = doc(db, "users", usersId);
        await deleteDoc(assignmentDoc);
    }
    catch (error) {
        console.error("Fel vid borttagning av jobbannons:", error);
        throw error;
    }
}
// Inkludera dokument-ID som nyckel
export function withKey(doc) {
    const data = doc.data();
    return { ...data, id: doc.id };
}
