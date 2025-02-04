import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore/lite";
import { db } from "./firebase.js";

const userCollection = collection(db, "users");

export async function GetUser(): Promise<any[]> {
    try {
        const snapshot = await getDocs(userCollection);
        return snapshot.docs.map((doc) => withKey(doc));
    } catch (error) {
        console.error("Fel vid hämtning av användare:", error);
        return [];
    }
}

export async function AddUser(data: {
    firstName: string;
    age: string;
    city: string;
    gender: string;
    sexualOrientation: string;
    religion: string;
    interests: string[];
    hasChildren: boolean;
    wantsChildren: boolean;
    smokes: string;
    relationshipStatus: string;
    education: string;
    photo: File | null;
    favoriteSong: string | '';
    favoriteMovie: string |'';
    email: string;
    lifeStatement1: string;
    lifeStatement2:string;
}): Promise<string> {
    try {
        const docRef = await addDoc(userCollection, data);
        return docRef.id;
    } catch (error) {
        console.error("Fel vid skapande av användare:", error);
        throw error;
    }
}



// Ta bort en användare
export async function DeleteUser(usersId: string): Promise<void> {
    try {
        const user = doc(db, "users", usersId);
        await deleteDoc(user);
    } catch (error) {
        console.error("Fel vid borttagning av jobbannons:", error);
        throw error;
    }
}

// Inkludera dokument-ID som nyckel
export function withKey(doc: any): any {
    const data = doc.data();
    return { ...data, id: doc.id };
}