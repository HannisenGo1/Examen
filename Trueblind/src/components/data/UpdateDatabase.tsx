import { User } from "../../interface/interfaceUser";
import "firebase/firestore";  
import { doc, updateDoc } from "firebase/firestore"; 
import { db } from "./firebase";

const updateUserInDatabase = async (updatedUser: User) => {
  const userRef = doc(db, 'users', updatedUser.id); 
  
  try {
    await updateDoc(userRef, {
      credits: updatedUser.credits,
      vipStatus: updatedUser.vipStatus,
      vipExpiry: updatedUser.vipExpiry,
      vipPlusStatus: updatedUser.vipPlusStatus,
      vipPlusExpiry: updatedUser.vipPlusExpiry,
    });
    console.log("Användaruppdatering lyckades i databasen.");
  } catch (error) {
    console.error("Fel vid uppdatering av användare i databasen:", error);
  }
};

export { updateUserInDatabase };