import { User } from "../../interface/interfaceUser";
 
import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "./firebase";

export const updateUserInDatabase = async (updatedUser: User) => {
  const userRef = doc(db, 'users', updatedUser.id);

  
  const userDataToUpdate = {
    credits: updatedUser.credits ?? 0, 
    vipStatus: updatedUser.vipStatus ?? false,
    vipExpiry: updatedUser.vipExpiry ?? null, 
    vipPlusStatus: updatedUser.vipPlusStatus ?? false,
    vipPlusExpiry: updatedUser.vipPlusExpiry ?? null, 
    purchasedEmojis: updatedUser.purchasedEmojis ?? [], 
  };

  try {
    console.log('uppdateras användaren?', updatedUser);
    await updateDoc(userRef, userDataToUpdate);
    console.log("Användaruppdatering lyckades i databasen.");
  } catch (error) {
    console.error("Fel vid uppdatering av användare i databasen:", error);
  }
};
