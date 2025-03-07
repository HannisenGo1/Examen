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
    city: updatedUser.city ?? null,
    sexualOrientation: updatedUser.sexualOrientation ?? null,
  };

  try {
    await updateDoc(userRef, userDataToUpdate);
  } catch (error) {
    console.error("Fel vid uppdatering av användare i databasen:", error);
  }
};

export const updateEmojiCountInDatabase = async (userId: string, emojiName: string, count: number) => {
  const userRef = doc(db, 'users', userId);
  const userDataToUpdate = {
    [`purchasedEmojis.${emojiName}.count`]: count, 
  };

  try {
    await updateDoc(userRef, userDataToUpdate);
  } catch (error) {
    console.error("Fel vid uppdatering av emoji count i Firebase:", error);
  }
};

