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
export async function UpdateUser(usersId, updatedData) {
    try {
        const userDoc = doc(db, 'users', usersId);
        await updateDoc(userDoc, updatedData);
        console.log('Användardata uppdaterad!');
    }
    catch (error) {
        console.error('Fel vid uppdatering av användare:', error);
        throw error;
    }
}
export async function DeleteUser(usersId) {
    try {
        const user = doc(db, "users", usersId);
        await deleteDoc(user);
    }
    catch (error) {
        console.error("Fel vid borttagning av jobbannons:", error);
        throw error;
    }
}
export function withKey(doc) {
    const data = doc.data();
    return { ...data, id: doc.id };
}
