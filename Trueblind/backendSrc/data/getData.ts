import { collection, getDocs, getDoc, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore/lite";
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
    id?: string;
    password:string;
}): Promise<string> {
    try {
        const docRef = await addDoc(userCollection, data);
        return docRef.id;
    } catch (error) {
        console.error("Fel vid skapande av användare:", error);
        throw error;
    }
}
export async function UpdateUser(userId: string, updatedData: Partial<{
    firstName: string;
    age: number;
    city: string;
    gender: string;
    sexualOrientation: string;
    religion: string;
    lifeStatement1?: string;
    lifeStatement2?: string;
    id?: string;
    interests: string[];
    hasChildren: boolean;
    wantsChildren: boolean;
    smokes: string;
    relationshipStatus: string;
    education: string;
    photo?: string;
}>): Promise<void> {
    try {
        const userDoc = doc(db, "users", userId);
        const userSnap = await getDoc(userDoc);

        if (!userSnap.exists()) {
            throw new Error("Användaren hittades inte.");
        }

        await updateDoc(userDoc, updatedData); 
        console.log("Användardata uppdaterad!");
    } catch (error) {
        console.error("Fel vid uppdatering av användare:", error);
        throw error;
    }
}
export async function GetUserById(userId: string) {
    const userDoc = doc(db, "users", userId);
    const snapshot = await getDoc(userDoc);

    if (!snapshot.exists()) {
        throw new Error("Användaren hittades inte.");
    }

    return { id: snapshot.id, ...snapshot.data() };
}
export async function DeleteUser(usersId: string): Promise<void> {
    try {
        const user = doc(db, "users", usersId);
        await deleteDoc(user);
    } catch (error) {
        console.error("Fel vid borttagning av jobbannons:", error);
        throw error;
    }
}


export function withKey(doc: any): any {
    const data = doc.data();
    return { ...data, id: doc.id };
}